import Contact from '../models/Contact.js';
import User from '../models/User.js';
import { createContactSchema, updateContactSchema } from '../validators/contactValidator.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import { sendContactEmail } from '../config/nodemailer.js';
import ApiError from '../utils/apiError.js';
import logger from '../config/winston.js';

// @desc    Create new contact
// @route   POST /api/contact
// @access  Private
export const createContact = async (req, res, next) => {
  try {
    // Parse Zod schema on req.body
    const validationResult = createContactSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new ApiError(400, 'Validation errors occurred', errors);
    }

    const contactData = { ...validationResult.data, createdBy: req.user._id };

    // Handle Profile Image Upload
    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file);
        contactData.profileImage = uploadResult.secure_url;
        contactData.profileImagePublicId = uploadResult.public_id;
      } catch (err) {
        logger.error(`Image upload failed during contact creation: ${err.message}`);
        // Continue contact creation without image, or throw error depending on strictness
      }
    }

    const contact = await Contact.create(contactData);
    logger.info(`Contact created: ${contact._id} by user: ${req.user.email}`);

    // Trigger Notification Email (non-blocking)
    sendContactEmail('create', contact, req.user.email);

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contacts list with search, filter, sort, paginate
// @route   GET /api/contact
// @access  Private
export const getContacts = async (req, res, next) => {
  try {
    const {
      search,
      company,
      sort,
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    // Filter build
    const filter = {};

    // Enforce authorization checks: Standard user sees only their own, admin can see all
    if (req.user.role !== 'Admin') {
      filter.createdBy = req.user._id;
    } else if (req.query.createdBy) {
      // Admin can filter by user who created the contact
      filter.createdBy = req.query.createdBy;
    }

    // Add Company filter
    if (company) {
      filter.company = { $regex: company, $options: 'i' };
    }

    // Add Search criteria (name or email or company)
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Build Sorting Criteria
    let sortObj = {};
    if (sort === 'name') {
      sortObj.firstName = order === 'asc' ? 1 : -1;
      sortObj.lastName = order === 'asc' ? 1 : -1;
    } else if (sort === 'date') {
      sortObj.createdAt = order === 'asc' ? 1 : -1;
    } else {
      // Default sort is createdAt desc
      sortObj.createdAt = -1;
    }

    // Execute queries
    const totalContacts = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .populate('createdBy', 'fullName email role')
      .sort(sortObj)
      .skip(skipNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      contacts,
      pagination: {
        total: totalContacts,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(totalContacts / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get individual contact details
// @route   GET /api/contact/:id
// @access  Private
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id).populate(
      'createdBy',
      'fullName email role'
    );

    if (!contact) {
      throw new ApiError(404, 'Contact not found');
    }

    // Authorization check
    if (
      req.user.role !== 'Admin' &&
      contact.createdBy._id.toString() !== req.user._id.toString()
    ) {
      throw new ApiError(403, 'Forbidden. You do not own this contact.');
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact details
// @route   PUT /api/contact/:id
// @access  Private
export const updateContact = async (req, res, next) => {
  try {
    // Validate request body
    const validationResult = updateContactSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new ApiError(400, 'Validation errors occurred', errors);
    }

    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      throw new ApiError(404, 'Contact not found');
    }

    // Authorization check
    if (
      req.user.role !== 'Admin' &&
      contact.createdBy.toString() !== req.user._id.toString()
    ) {
      throw new ApiError(403, 'Forbidden. You do not own this contact.');
    }

    const contactData = { ...validationResult.data };

    // Image upload handling
    if (req.file) {
      try {
        // Upload new image
        const uploadResult = await uploadImage(req.file);
        
        // Delete old image if existed
        if (contact.profileImagePublicId) {
          await deleteImage(contact.profileImagePublicId);
        }

        contactData.profileImage = uploadResult.secure_url;
        contactData.profileImagePublicId = uploadResult.public_id;
      } catch (err) {
        logger.error(`Image upload failed during contact update: ${err.message}`);
      }
    }

    // Save update
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactData },
      { new: true, runValidators: true }
    );

    logger.info(`Contact updated: ${contact._id} by user: ${req.user.email}`);

    // Send email notification
    sendContactEmail('update', contact, req.user.email);

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      throw new ApiError(404, 'Contact not found');
    }

    // Authorization check
    if (
      req.user.role !== 'Admin' &&
      contact.createdBy.toString() !== req.user._id.toString()
    ) {
      throw new ApiError(403, 'Forbidden. You do not own this contact.');
    }

    // Delete image from storage
    if (contact.profileImagePublicId) {
      await deleteImage(contact.profileImagePublicId);
    }

    await Contact.findByIdAndDelete(req.params.id);
    logger.info(`Contact deleted: ${req.params.id} by user: ${req.user.email}`);

    // Send email notification
    sendContactEmail('delete', contact, req.user.email);

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Retrieve statistics for dashboard (Counts, Recent contacts, activity feed)
// @route   GET /api/contact/dashboard-stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'Admin';
    const contactFilter = isAdmin ? {} : { createdBy: req.user._id };

    // Total Contacts
    const totalContacts = await Contact.countDocuments(contactFilter);

    // Total Users (Only Admin needs real count, for regular user return count of system users as overview context)
    const totalUsers = await User.countDocuments({});

    // Recent Contacts (last 5 created)
    const recentContacts = await Contact.find(contactFilter)
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Latest Activity Log
    // Since we don't have a separate Activity Model, we can dynamically build activity logs
    // based on when the contacts were last updated or created
    const recentUpdates = await Contact.find(contactFilter)
      .populate('createdBy', 'fullName email')
      .sort({ updatedAt: -1 })
      .limit(5);

    const activities = [];

    // Synthesize simple activity objects from creation & updates
    recentContacts.forEach((c) => {
      activities.push({
        id: `create-${c._id}`,
        type: 'create',
        message: `Contact "${c.firstName} ${c.lastName}" was created`,
        time: c.createdAt,
        user: c.createdBy?.fullName || 'System',
      });
    });

    recentUpdates.forEach((c) => {
      if (c.updatedAt.getTime() !== c.createdAt.getTime()) {
        activities.push({
          id: `update-${c._id}`,
          type: 'update',
          message: `Contact "${c.firstName} ${c.lastName}" details were modified`,
          time: c.updatedAt,
          user: c.createdBy?.fullName || 'System',
        });
      }
    });

    // Sort synthesis activity list by time descending, cap at 6 items
    const sortedActivities = activities
      .sort((a, b) => b.time - a.time)
      .slice(0, 6);

    res.status(200).json({
      success: true,
      stats: {
        totalContacts,
        totalUsers,
        recentContacts,
        latestActivity: sortedActivities,
      },
    });
  } catch (error) {
    next(error);
  }
};

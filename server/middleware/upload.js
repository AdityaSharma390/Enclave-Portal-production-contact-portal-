import multer from 'multer';
import ApiError from '../utils/apiError.js';

// Configure memory storage to allow direct upload to Cloudinary stream or buffer saving
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file type. Only image files are allowed!'), false);
  }
};

// Size limit of 5MB
const limits = {
  fileSize: 5 * 1024 * 1024,
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

export default upload;

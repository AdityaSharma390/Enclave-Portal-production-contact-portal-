import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud, X, AlertCircle, Building, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { createContact, getContactById, updateContact } from '../services/contactService.js';
import useAuth from '../hooks/useAuth.js';

const ContactForm = () => {
  const { id } = useParams(); // present in edit mode
  const isEditMode = !!id;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form Fields State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Profile Image State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Status handlers
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [saveLoading, setSaveLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);

  // Load details in Edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchContactDetails = async () => {
      try {
        const res = await getContactById(id);
        const { contact } = res;
        setFirstName(contact.firstName || '');
        setLastName(contact.lastName || '');
        setEmail(contact.email || '');
        setPhone(contact.phone || '');
        setCompany(contact.company || '');
        setAddress(contact.address || '');
        setNotes(contact.notes || '');
        if (contact.profileImage) {
          setImagePreview(contact.profileImage);
        }
      } catch (err) {
        console.error(err);
        setGlobalError('Failed to fetch contact details for editing.');
      } finally {
        setPageLoading(false);
      }
    };

    fetchContactDetails();
  }, [id, isEditMode]);

  // Clean memory URL previews
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Drag-and-Drop Image Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processImageFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processImageFile(file);
    }
  };

  const processImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setGlobalError('Please select a valid image file (PNG, JPG, JPEG)');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setGlobalError('');
  };

  const handleClearImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setFieldErrors([]);
    setSaveLoading(true);

    // Build multipart/form-data
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('company', company);
    formData.append('address', address);
    formData.append('notes', notes);

    if (imageFile) {
      formData.append('profileImage', imageFile);
    }

    try {
      if (isEditMode) {
        await updateContact(id, formData);
        navigate(`/contacts/${id}`);
      } else {
        await createContact(formData);
        navigate('/contacts');
      }
    } catch (err) {
      console.error(err);
      const resData = err.response?.data;
      if (resData?.errors) {
        setFieldErrors(resData.errors);
      } else {
        setGlobalError(resData?.message || 'Failed to save contact. Please check details.');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const getFieldError = (fieldName) => {
    return fieldErrors.find((fe) => fe.field === fieldName)?.message;
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 mt-2 text-sm font-medium">Fetching details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Title / Back navigation banner */}
      <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-brand-800/40 pb-4">
        <div>
          <Link
            to={isEditMode ? `/contacts/${id}` : '/contacts'}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel Form
          </Link>
          <h1 className="text-xl font-bold font-display text-slate-800 dark:text-white mt-2">
            {isEditMode ? 'Modify Contact Details' : 'Create New Contact'}
          </h1>
        </div>
      </div>

      {globalError && (
        <div className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 rounded-xl dark:bg-red-950/20 dark:text-red-400 border border-red-200/30">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Picture Uploader */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Profile Photo
          </label>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
              dragActive
                ? 'border-brand-500 bg-brand-500/5'
                : 'border-slate-300 hover:border-brand-400 dark:border-brand-800'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative group w-28 h-28">
                <img
                  src={imagePreview}
                  alt="Avatar preview"
                  className="w-full h-full rounded-full object-cover shadow-md border-2 border-brand-500/10"
                />
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 hover:scale-105 transition-transform"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl mb-3 dark:bg-brand-500/20">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Drag & drop picture here
                </span>
                <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                  Or select file
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Text Input Fields */}
        <div className="glass-card p-6 rounded-2xl md:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                First Name *
              </label>
              <input
                type="text"
                required
                className={`w-full glass-input ${
                  getFieldError('firstName') ? 'border-red-500 dark:border-red-500' : ''
                }`}
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {getFieldError('firstName') && (
                <p className="text-xs text-red-500 mt-1">{getFieldError('firstName')}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Last Name *
              </label>
              <input
                type="text"
                required
                className={`w-full glass-input ${
                  getFieldError('lastName') ? 'border-red-500 dark:border-red-500' : ''
                }`}
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {getFieldError('lastName') && (
                <p className="text-xs text-red-500 mt-1">{getFieldError('lastName')}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  className={`w-full pl-9 glass-input ${
                    getFieldError('email') ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {getFieldError('email') && (
                <p className="text-xs text-red-500 mt-1">{getFieldError('email')}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  className={`w-full pl-9 glass-input ${
                    getFieldError('phone') ? 'border-red-500 dark:border-red-500' : ''
                  }`}
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              {getFieldError('phone') && (
                <p className="text-xs text-red-500 mt-1">{getFieldError('phone')}</p>
              )}
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Company Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Building className="w-4 h-4" />
              </span>
              <input
                type="text"
                className={`w-full pl-9 glass-input ${
                  getFieldError('company') ? 'border-red-500 dark:border-red-500' : ''
                }`}
                placeholder="Enclave Org"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            {getFieldError('company') && (
              <p className="text-xs text-red-500 mt-1">{getFieldError('company')}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Street / Location Address
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-slate-400">
                <MapPin className="w-4 h-4" />
              </span>
              <textarea
                rows={2}
                className={`w-full pl-9 glass-input ${
                  getFieldError('address') ? 'border-red-500 dark:border-red-500' : ''
                }`}
                placeholder="Suite 100, 123 Main St"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            {getFieldError('address') && (
              <p className="text-xs text-red-500 mt-1">{getFieldError('address')}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Private Notes / Description
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-slate-400">
                <FileText className="w-4 h-4" />
              </span>
              <textarea
                rows={3}
                className={`w-full pl-9 glass-input ${
                  getFieldError('notes') ? 'border-red-500 dark:border-red-500' : ''
                }`}
                placeholder="Provide details about relationship, tags, or context..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            {getFieldError('notes') && (
              <p className="text-xs text-red-500 mt-1">{getFieldError('notes')}</p>
            )}
          </div>

          {/* Form Actions Footer buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-brand-800/40">
            <Link
              to={isEditMode ? `/contacts/${id}` : '/contacts'}
              className="px-4 py-2.5 text-sm font-semibold border border-slate-300 rounded-xl text-slate-700 bg-white hover:bg-slate-50 dark:bg-brand-900 dark:border-brand-800 dark:text-slate-300 dark:hover:bg-brand-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saveLoading}
              className="inline-flex items-center gap-1.5 bg-brand-500 text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-brand-600 transition-colors shadow-md shadow-brand-500/10 disabled:bg-brand-400"
            >
              {saveLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEditMode ? 'Update Contact' : 'Save Contact'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;

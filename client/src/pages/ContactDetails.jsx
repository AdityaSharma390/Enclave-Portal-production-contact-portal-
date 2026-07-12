import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, MapPin, FileText, Calendar, UserCheck } from 'lucide-react';
import { getContactById, deleteContact } from '../services/contactService.js';
import { ProfileSkeleton } from '../components/Skeleton.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { getInitials, getAvatarColor, formatDate, getImageUrl } from '../utils/helpers.js';

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchContact = async () => {
    setLoading(true);
    try {
      const res = await getContactById(id);
      setContact(res.contact);
    } catch (err) {
      console.error(err);
      setError('Contact not found or you do not have permission to view it.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, [id]);

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await deleteContact(id);
      setDeleteModalOpen(false);
      navigate('/contacts');
    } catch (err) {
      console.error(err);
      alert('Failed to delete contact record.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !contact) {
    return (
      <div className="space-y-4">
        <Link to="/contacts" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-500">
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </Link>
        <div className="glass-card p-8 rounded-2xl text-center text-red-500 font-medium">
          {error || 'Could not load contact.'}
        </div>
      </div>
    );
  }

  const name = `${contact.firstName} ${contact.lastName}`;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Navigation Headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link
          to="/contacts"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to={`/contacts/${id}/edit`}
            className="inline-flex items-center gap-1.5 border border-slate-300 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 dark:bg-brand-900 dark:border-brand-800 dark:text-slate-300 dark:hover:bg-brand-800 transition-colors duration-200"
          >
            <Edit className="w-4 h-4" />
            Edit details
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-red-500 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-red-600 transition-colors duration-200 shadow-md shadow-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
            Delete contact
          </button>
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Card Banner */}
        <div className="glass-card p-6 rounded-2xl md:col-span-4 flex flex-col items-center text-center">
          {contact.profileImage ? (
            <img
              src={getImageUrl(contact.profileImage)}
              alt={`${name} avatar`}
              className="w-28 h-28 rounded-full object-cover border-2 border-brand-500/20 shadow-md mb-4"
            />
          ) : (
            <div
              className="flex items-center justify-center w-28 h-28 rounded-full font-bold text-white text-3xl shadow-inner mb-4"
              style={{ backgroundColor: getAvatarColor(name) }}
            >
              {getInitials(name)}
            </div>
          )}
          <h2 className="text-xl font-bold text-slate-800 dark:text-white truncate max-w-full">
            {name}
          </h2>
          <p className="text-sm text-slate-400 mt-1 truncate max-w-full">
            {contact.company || 'Private contact'}
          </p>

          <div className="w-full border-t border-slate-200/50 dark:border-brand-800/40 my-5"></div>

          {/* Quick email buttons */}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 shadow-md shadow-brand-500/10 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Compose Email
            </a>
          )}
        </div>

        {/* Informative fields panel */}
        <div className="glass-card p-6 rounded-2xl md:col-span-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200/50 dark:border-brand-800/40 pb-3">
            Contact Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 dark:bg-brand-950 rounded-lg text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">
                  Email Address
                </span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {contact.email || <span className="text-slate-400 font-normal italic">None provided</span>}
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 dark:bg-brand-950 rounded-lg text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">
                  Phone Number
                </span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {contact.phone || <span className="text-slate-400 font-normal italic">None provided</span>}
                </span>
              </div>
            </div>

            {/* Company */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 dark:bg-brand-950 rounded-lg text-slate-400">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">
                  Company Name
                </span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {contact.company || <span className="text-slate-400 font-normal italic">None provided</span>}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 dark:bg-brand-950 rounded-lg text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">
                  Location Address
                </span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 block whitespace-pre-wrap">
                  {contact.address || <span className="text-slate-400 font-normal italic">None provided</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Notes description */}
          <div className="flex items-start gap-3 border-t border-slate-200/50 dark:border-brand-800/40 pt-5">
            <div className="p-2 bg-slate-100 dark:bg-brand-950 rounded-lg text-slate-400 flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="text-xs text-slate-400 font-semibold block uppercase">
                Notes / Context
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap bg-slate-50/50 dark:bg-brand-950/40 p-4 rounded-xl border border-slate-200/20 dark:border-brand-800/30">
                {contact.notes || <span className="text-slate-400 italic">No notes saved</span>}
              </p>
            </div>
          </div>

          {/* User logs */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 border-t border-slate-200/50 dark:border-brand-800/40 pt-5 text-xs text-slate-400 font-semibold uppercase">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              Saved By: {contact.createdBy?.fullName || 'System'}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Created: {formatDate(contact.createdAt)}
            </span>
            {contact.updatedAt !== contact.createdAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Updated: {formatDate(contact.updatedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Contact Record?"
        message={`Are you sure you want to delete ${name} from Enclave? This operation is permanent and will notify watchers via SMTP.`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete Permanent'}
        cancelText="Keep Record"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        isDanger={true}
      />
    </div>
  );
};

export default ContactDetails;

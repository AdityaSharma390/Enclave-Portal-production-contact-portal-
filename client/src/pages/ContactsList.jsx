import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Mail, Phone, Building } from 'lucide-react';
import { getContacts, deleteContact } from '../services/contactService.js';
import { TableSkeleton } from '../components/Skeleton.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import { getInitials, getAvatarColor, getImageUrl } from '../utils/helpers.js';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Query Filters & Search params
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('');
  const [sort, setSort] = useState('date'); // 'date' or 'name'
  const [order, setOrder] = useState('desc'); // 'asc' or 'desc'
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);

  // Search input typing debounce trigger
  const [searchInput, setSearchInput] = useState('');

  // Delete State Dialog
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [selectedDeleteName, setSelectedDeleteName] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Search Debounce Effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await getContacts({
        search,
        company,
        sort,
        order,
        page,
        limit,
      });
      setContacts(res.contacts);
      setTotalPages(res.pagination.pages);
      setTotalContacts(res.pagination.total);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch contact details. Please reload.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [search, company, sort, order, page, limit]);

  const handleDeleteTrigger = (id, name) => {
    setSelectedDeleteId(id);
    setSelectedDeleteName(name);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteId) return;
    setDeleteLoading(true);
    try {
      await deleteContact(selectedDeleteId);
      setDeleteModalOpen(false);
      fetchContacts(); // reload list
    } catch (err) {
      console.error(err);
      alert('Failed to delete contact record.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-800 dark:text-white">
            Workspace Contacts
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Total records: <span className="font-semibold text-slate-700 dark:text-slate-300">{totalContacts}</span>
          </p>
        </div>
        <Link
          to="/contacts/new"
          className="inline-flex items-center gap-1.5 bg-brand-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-brand-600 transition-colors shadow-md shadow-brand-500/10"
        >
          <Plus className="w-4 h-4" />
          Create Contact
        </Link>
      </div>

      {/* Control panel (Search & Filter inputs) */}
      <div className="glass-card p-5 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search bar input */}
          <div className="relative md:col-span-5">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by name, email, phone, company..."
              className="w-full pl-9 pr-4 py-2 text-sm glass-input rounded-xl"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          {/* Company filter */}
          <div className="relative md:col-span-3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Building className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Filter by company name"
              className="w-full pl-9 pr-4 py-2 text-sm glass-input rounded-xl"
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Sorting controls */}
          <div className="flex items-center gap-2 md:col-span-4">
            <div className="flex-1 flex gap-1 bg-slate-100 dark:bg-brand-950 p-1 rounded-xl">
              <button
                onClick={() => {
                  setSort('date');
                  setOrder(order === 'desc' ? 'asc' : 'desc');
                }}
                className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
                  sort === 'date'
                    ? 'bg-white dark:bg-brand-900 text-brand-500 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                Date Created
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setSort('name');
                  setOrder(order === 'desc' ? 'asc' : 'desc');
                }}
                className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
                  sort === 'name'
                    ? 'bg-white dark:bg-brand-900 text-brand-500 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                Sort Name
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Main Table view */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : contacts.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <p className="text-slate-400 dark:text-slate-500 font-medium">
            No contacts match the criteria.
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-brand-800/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-brand-950 border-b border-slate-200/50 dark:border-brand-800/40 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Phone Number</th>
                  <th className="py-4 px-6">Company / Org</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-brand-800/40 text-sm">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="hover:bg-slate-100/50 dark:hover:bg-brand-850/50 transition-colors"
                  >
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {contact.profileImage ? (
                          <img
                            src={getImageUrl(contact.profileImage)}
                            alt={`${contact.firstName} avatar`}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200/50 dark:border-brand-850/40 shadow-sm"
                          />
                        ) : (
                          <div
                            className="flex items-center justify-center w-9 h-9 rounded-full font-semibold text-white text-xs"
                            style={{ backgroundColor: getAvatarColor(`${contact.firstName} ${contact.lastName}`) }}
                          >
                            {getInitials(`${contact.firstName} ${contact.lastName}`)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {contact.firstName} {contact.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {contact.email ? (
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {contact.email}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {contact.phone ? (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {contact.phone}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-slate-600 dark:text-slate-300 font-medium">
                      {contact.company || (
                        <span className="text-slate-400 dark:text-slate-500 font-normal">Private</span>
                      )}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/contacts/${contact._id}`}
                          title="View details"
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-brand-800 dark:hover:text-slate-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/contacts/${contact._id}/edit`}
                          title="Edit contact"
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-500 dark:text-slate-400 dark:hover:bg-brand-800 dark:hover:text-slate-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteTrigger(contact._id, `${contact.firstName} ${contact.lastName}`)}
                          title="Delete contact"
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-500 dark:text-slate-400 dark:hover:bg-brand-800 dark:hover:text-slate-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 bg-slate-50 dark:bg-brand-950 border-t border-slate-200/50 dark:border-brand-800/40">
            {/* Page Size limit selector */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              Show
              <select
                className="bg-white dark:bg-brand-900 border border-slate-300 dark:border-brand-800 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 focus:outline-none"
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value, 10));
                  setPage(1);
                }}
              >
                <option value={5}>5 records</option>
                <option value={10}>10 records</option>
                <option value={20}>20 records</option>
                <option value={50}>50 records</option>
              </select>
            </div>

            {/* Paging controls */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-400">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-1.5 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:border-brand-800 dark:text-slate-400 dark:hover:bg-brand-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-1.5 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:border-brand-800 dark:text-slate-400 dark:hover:bg-brand-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Contact Record?"
        message={`Are you sure you want to delete ${selectedDeleteName} from your Enclave? This action is permanent and will trigger email alerts.`}
        confirmText={deleteLoading ? 'Deleting...' : 'Delete Permanent'}
        cancelText="Keep Contact"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        isDanger={true}
      />
    </div>
  );
};

export default ContactsList;

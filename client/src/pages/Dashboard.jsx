import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, Activity, Plus, ArrowRight, Mail, Phone, Calendar } from 'lucide-react';
import { getDashboardStats } from '../services/contactService.js';
import { StatsSkeleton } from '../components/Skeleton.jsx';
import { getInitials, getAvatarColor, formatDate, getImageUrl } from '../utils/helpers.js';
import useAuth from '../hooks/useAuth.js';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.stats);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch dashboard metrics. Please reload.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-slate-200 dark:bg-brand-800 rounded animate-pulse"></div>
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="h-64 bg-slate-200 dark:bg-brand-800 rounded animate-pulse"></div>
          <div className="h-64 bg-slate-200 dark:bg-brand-800 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-radial from-brand-600 to-brand-700 p-6 rounded-2xl text-white shadow-xl shadow-brand-500/10">
        <div>
          <h1 className="text-2xl font-bold font-display">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-brand-100 text-sm mt-1">
            {user?.role === 'Admin'
              ? 'Admin Dashboard: Monitor global contacts activity and user records.'
              : 'User Dashboard: Access your contacts records and actions.'}
          </p>
        </div>
        <Link
          to="/contacts/new"
          className="inline-flex items-center gap-1.5 bg-white text-brand-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-lg shadow-black/10"
        >
          <Plus className="w-4 h-4" />
          Create Contact
        </Link>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total Contacts card */}
          <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Total Contacts
              </p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                {stats.totalContacts}
              </h3>
            </div>
            <div className="p-3 bg-brand-500/10 text-brand-500 dark:bg-brand-500/20 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Total System Users (Admin only real, User shows context) */}
          <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                System Users
              </p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                {stats.totalUsers}
              </h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 rounded-xl">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Activity Logs Count card */}
          <div className="glass-card p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Recent Actions
              </p>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                {stats.latestActivity?.length || 0}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Lists / Feeds Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts Preview */}
        <div className="glass-card p-6 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-brand-800/40 pb-4 mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Recent Contacts
            </h3>
            <Link
              to="/contacts"
              className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 space-y-4">
            {stats?.recentContacts?.length === 0 ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
                No contacts saved yet. Click 'Create Contact' to begin.
              </div>
            ) : (
              stats?.recentContacts?.map((contact) => (
                <Link
                  key={contact._id}
                  to={`/contacts/${contact._id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100/50 dark:hover:bg-brand-850/50 transition-colors border border-transparent hover:border-slate-200/45 dark:hover:border-brand-800/30"
                >
                  {contact.profileImage ? (
                    <img
                      src={getImageUrl(contact.profileImage)}
                      alt={`${contact.firstName} avatar`}
                      className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200/50 dark:border-brand-800/30"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full font-semibold text-white text-sm"
                      style={{ backgroundColor: getAvatarColor(`${contact.firstName} ${contact.lastName}`) }}
                    >
                      {getInitials(`${contact.firstName} ${contact.lastName}`)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {contact.company || 'Private Contact'}
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-400 flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(contact.createdAt)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Latest Activity Feed */}
        <div className="glass-card p-6 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-brand-800/40 pb-4 mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Workspace Activity
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              Live updates
            </span>
          </div>

          <div className="flex-1 space-y-4">
            {stats?.latestActivity?.length === 0 ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
                No active workspace logs.
              </div>
            ) : (
              stats?.latestActivity?.map((activity) => (
                <div key={activity.id} className="flex gap-3 text-sm">
                  <div className="relative flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full mt-1.5 ${
                        activity.type === 'create' ? 'bg-emerald-500' : 'bg-brand-500'
                      }`}
                    ></div>
                    <div className="w-0.5 flex-1 bg-slate-200 dark:bg-brand-800 mt-2 -mb-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {activity.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Triggered by <span className="font-semibold text-slate-500 dark:text-slate-400">{activity.user}</span> • {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

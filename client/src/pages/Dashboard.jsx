import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, Activity, Plus, ArrowRight, Calendar, Clock } from 'lucide-react';
import { getDashboardStats } from '../services/contactService.js';
import { StatsSkeleton } from '../components/Skeleton.jsx';
import { getInitials, getAvatarColor, formatDate } from '../utils/helpers.js';
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
        <div className="h-10 w-48 bg-slate-200 dark:bg-brand-850 rounded animate-pulse"></div>
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="h-64 bg-slate-200 dark:bg-brand-850 rounded animate-pulse"></div>
          <div className="h-64 bg-slate-200 dark:bg-brand-850 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Reverted original top banner with clean styling */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-brand-900 p-6 rounded-xl border border-slate-200 dark:border-brand-800/40 shadow-xs">
        <div>
          <h1 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            Welcome back, {user?.fullName || 'User'}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            {user?.role === 'Admin'
              ? 'Security Administrator: Accessing system logs and aggregated metrics.'
              : 'Agent Workspace: Manage your secure contacts and profiles.'}
          </p>
        </div>
        <Link
          to="/contacts/new"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Contact
        </Link>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total Contacts */}
          <div className="bg-white dark:bg-brand-900 p-6 rounded-xl border border-slate-200 dark:border-brand-800/40 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Contacts
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {stats.totalContacts}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* System Users */}
          <div className="bg-white dark:bg-brand-900 p-6 rounded-xl border border-slate-200 dark:border-brand-800/40 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                System Users
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {stats.totalUsers}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Recent Actions */}
          <div className="bg-white dark:bg-brand-900 p-6 rounded-xl border border-slate-200 dark:border-brand-800/40 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Recent Actions
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {stats.latestActivity?.length || 0}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout (Original design restored) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Recent Contacts List */}
        <div className="bg-white dark:bg-brand-900 p-6 rounded-xl border border-slate-200 dark:border-brand-800/40 shadow-xs flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-brand-850/60 pb-4 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Contacts
            </h3>
            <Link
              to="/contacts"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 space-y-4">
            {stats?.recentContacts?.length === 0 ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">
                No contacts saved yet. Click 'Create Contact' to begin.
              </div>
            ) : (
              stats?.recentContacts?.map((contact) => (
                <Link
                  key={contact._id}
                  to={`/contacts/${contact._id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-brand-850/30 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-brand-800/20"
                >
                  {contact.profileImage ? (
                    <img
                      src={contact.profileImage}
                      alt={`${contact.firstName} avatar`}
                      className="w-9 h-9 rounded-full object-cover border border-slate-100 dark:border-brand-850/40 shadow-xs"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-full font-semibold text-white text-xs"
                      style={{ backgroundColor: getAvatarColor(`${contact.firstName} ${contact.lastName}`) }}
                    >
                      {getInitials(`${contact.firstName} ${contact.lastName}`)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {contact.company || 'Private Contact'}
                    </p>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatDate(contact.createdAt)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Workspace Activity Feed */}
        <div className="bg-white dark:bg-brand-900 p-6 rounded-xl border border-slate-200 dark:border-brand-800/40 shadow-xs flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-brand-850/60 pb-4 mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Workspace Activity
            </h3>
            <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest">
              Live updates
            </span>
          </div>

          <div className="flex-1 space-y-4">
            {stats?.latestActivity?.length === 0 ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">
                No active workspace logs.
              </div>
            ) : (
              stats?.latestActivity?.map((activity) => (
                <div key={activity.id} className="flex gap-3 text-xs">
                  <div className="relative flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                        activity.type === 'create' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                    ></div>
                    <div className="w-0.5 flex-1 bg-slate-100 dark:bg-brand-800 mt-2 -mb-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                      {activity.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
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

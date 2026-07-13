import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, Activity, Plus, ArrowRight, Calendar } from 'lucide-react';
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
        <div className="h-10 w-48 bg-[#1c1c1e] rounded-full animate-pulse"></div>
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="h-64 bg-[#1c1c1e] rounded-2xl animate-pulse"></div>
          <div className="h-64 bg-[#1c1c1e] rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white">
      {/* Reverted original top banner - Styled like the login page (Black / Lime-Green) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1c1c1e] p-6 rounded-2xl border border-slate-800/80 shadow-lg relative overflow-hidden">
        {/* Subtle grid accent background */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10">
          <h1 className="text-xl font-bold font-display text-white">
            Welcome back, {user?.fullName || 'User'}!
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-semibold">
            {user?.role === 'Admin'
              ? 'Security Administrator: Accessing system logs and aggregated metrics.'
              : 'Agent Workspace: Manage your secure contacts and profiles.'}
          </p>
        </div>
        <Link
          to="/contacts/new"
          className="relative z-10 inline-flex items-center gap-1.5 bg-[#dffe00] hover:bg-[#cbe600] text-black px-5 py-2.5 rounded-full font-bold transition-all shadow-md shadow-[#dffe00]/5 text-xs"
        >
          <Plus className="w-4 h-4" />
          Create Contact
        </Link>
      </div>

      {error && (
        <div className="p-4 text-xs text-red-400 bg-red-950/20 rounded-xl border border-red-500/20">
          {error}
        </div>
      )}

      {/* Metrics Cards - Dark Grey with Lime Green Accents */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Total Contacts */}
          <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-slate-800/80 shadow-md flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Contacts
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.totalContacts}
              </h3>
            </div>
            <div className="p-3 bg-[#dffe00]/10 text-[#dffe00] rounded-xl border border-[#dffe00]/15">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* System Users */}
          <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-slate-800/80 shadow-md flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                System Users
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.totalUsers}
              </h3>
            </div>
            <div className="p-3 bg-[#dffe00]/10 text-[#dffe00] rounded-xl border border-[#dffe00]/15">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Recent Actions */}
          <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-slate-800/80 shadow-md flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Recent Actions
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {stats.latestActivity?.length || 0}
              </h3>
            </div>
            <div className="p-3 bg-[#dffe00]/10 text-[#dffe00] rounded-xl border border-[#dffe00]/15">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout (Original design restored) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Recent Contacts List */}
        <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-slate-800/80 shadow-md flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recent Contacts
            </h3>
            <Link
              to="/contacts"
              className="text-xs font-bold text-[#dffe00] hover:underline flex items-center gap-0.5"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {stats?.recentContacts?.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No contacts saved yet. Click 'Create Contact' to begin.
              </div>
            ) : (
              stats?.recentContacts?.map((contact) => (
                <Link
                  key={contact._id}
                  to={`/contacts/${contact._id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/30 transition-colors border border-transparent hover:border-slate-800/40"
                >
                  {contact.profileImage ? (
                    <img
                      src={contact.profileImage}
                      alt={`${contact.firstName} avatar`}
                      className="w-9 h-9 rounded-full object-cover border border-slate-800 shadow-xs"
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
                    <p className="text-xs font-bold text-white truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {contact.company || 'Private Contact'}
                    </p>
                  </div>
                  <div className="text-right text-[10px] text-slate-500 flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {formatDate(contact.createdAt)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Workspace Activity Feed */}
        <div className="bg-[#1c1c1e] p-6 rounded-2xl border border-slate-800/80 shadow-md flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Workspace Activity
            </h3>
            <span className="text-[9px] uppercase font-bold text-[#dffe00] tracking-widest">
              Live updates
            </span>
          </div>

          <div className="flex-1 space-y-4">
            {stats?.latestActivity?.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No active workspace logs.
              </div>
            ) : (
              stats?.latestActivity?.map((activity) => (
                <div key={activity.id} className="flex gap-3 text-xs">
                  <div className="relative flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full mt-1.5 bg-[#dffe00] shadow-sm shadow-[#dffe00]/10"
                    ></div>
                    <div className="w-0.5 flex-1 bg-slate-800 mt-2 -mb-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200">
                      {activity.message}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Triggered by <span className="font-semibold text-slate-400">{activity.user}</span> • {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

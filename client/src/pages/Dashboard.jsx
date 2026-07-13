import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, Activity, Plus, ArrowRight, Mail, Phone, Calendar, Clock, MapPin, UserPlus, FileText, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { getDashboardStats } from '../services/contactService.js';
import { StatsSkeleton } from '../components/Skeleton.jsx';
import { getInitials, getAvatarColor, formatDate, getImageUrl } from '../utils/helpers.js';
import useAuth from '../hooks/useAuth.js';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeString, setTimeString] = useState('');

  // Clock widget update
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setTimeString(
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const name = user?.fullName || 'User Session';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Abstract fluid hero banner */}
      <div className="relative h-44 rounded-2xl overflow-hidden bg-gradient-to-r from-brand-700 via-indigo-700 to-teal-500 shadow-lg">
        {/* Soft geometric styling lines */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-300/10 rounded-full blur-2xl"></div>
        
        {/* Banner metadata */}
        <div className="absolute inset-0 flex items-center justify-between px-8 text-white">
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight">
              Workspace Overview
            </h1>
            <p className="text-slate-100 text-xs mt-1 uppercase tracking-wider font-semibold opacity-90">
              {user?.role === 'Admin' ? 'Security System Root' : 'Workspace Management Hub'}
            </p>
          </div>
          <Link
            to="/contacts/new"
            className="hidden sm:inline-flex items-center gap-1.5 bg-white text-brand-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-black/10"
          >
            <Plus className="w-4 h-4" />
            Create Contact
          </Link>
        </div>
      </div>

      {/* Floating profile card and timeline container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 -mt-10 relative z-10 px-4 lg:px-0">
        
        {/* Left Side: Floating user avatar card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-2xl p-6 shadow-xl border border-slate-200/60 dark:border-brand-800/40 bg-white dark:bg-brand-900 flex flex-col items-center text-center">
            {/* Overlapping rounded photo */}
            <div className="relative -mt-16 mb-4">
              <div
                className="flex items-center justify-center w-24 h-24 rounded-2xl font-bold text-white text-3xl shadow-lg border-4 border-white dark:border-brand-900"
                style={{ backgroundColor: getAvatarColor(name) }}
              >
                {getInitials(name)}
              </div>
              <span className="absolute bottom-1 right-1 w-4.5 h-4.5 bg-emerald-500 border-2 border-white dark:border-brand-900 rounded-full" title="Active session"></span>
            </div>

            <h2 className="text-lg font-bold text-slate-800 dark:text-white truncate max-w-full">
              {name}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
              {user?.role === 'Admin' ? 'HR Manager' : 'Portal Agent'}
            </p>

            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-3">
              Present
            </span>

            {/* Check-out clock widget (as seen in the screenshot) */}
            <div className="w-full border-t border-slate-100 dark:border-brand-850/60 my-5"></div>
            
            <div className="bg-slate-50 dark:bg-brand-950/60 rounded-xl p-4 w-full flex flex-col items-center border border-slate-100 dark:border-brand-850/30">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                <Clock className="w-4 h-4 text-brand-500" />
                Active Session Timer
              </div>
              <div className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-wider font-mono mt-1">
                {timeString || '00:00:00'}
              </div>
              
              <button
                type="button"
                className="mt-3 w-full py-1.5 px-4 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 text-xs font-semibold transition-all dark:border-red-950/40 dark:hover:bg-red-950/20"
                onClick={() => {
                  window.location.href = '/login';
                }}
              >
                Terminate Session
              </button>
            </div>

            {/* Reporting statistics inside left pane */}
            {stats && (
              <div className="w-full space-y-3 mt-5 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Total Contacts Managed</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{stats.totalContacts}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Active Workspace Users</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{stats.totalUsers}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Cards */}
          {stats && (
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Contacts</span>
                  <h4 className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{stats.totalContacts}</h4>
                </div>
                <Users className="w-5 h-5 text-brand-500" />
              </div>
              <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Users</span>
                  <h4 className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{stats.totalUsers}</h4>
                </div>
                <UserCheck className="w-5 h-5 text-teal-500" />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Timeline of Activities and recent actions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Navigation tabs like in screenshot */}
          <div className="glass-card rounded-2xl p-2 flex items-center border border-slate-200/60 dark:border-brand-800/40">
            <div className="flex items-center gap-1 w-full overflow-x-auto">
              <span className="px-4 py-2 text-xs font-bold text-brand-600 dark:text-teal-400 bg-brand-500/10 rounded-xl">
                Activities Timeline
              </span>
              <Link to="/contacts" className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Feeds
              </Link>
              <Link to="/profile" className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                Profile Settings
              </Link>
            </div>
          </div>

          {/* Timeline Feed Container */}
          <div className="glass-card rounded-2xl p-6 space-y-6 border border-slate-200/60 dark:border-brand-800/40">
            <h3 className="text-base font-bold text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-brand-850/60 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-500" />
              Recent Actions Log
            </h3>

            <div className="relative pl-6 sm:pl-10 space-y-6">
              {/* Vertical connecting line */}
              <div className="absolute left-[11px] sm:left-[19px] top-3 bottom-3 w-0.5 bg-slate-200 dark:bg-brand-800"></div>

              {stats?.latestActivity?.length === 0 ? (
                <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
                  No active workspace logs found.
                </div>
              ) : (
                stats?.latestActivity?.map((activity, idx) => {
                  // Soft coloring classes based on activity types
                  const isCreate = activity.type === 'create';
                  const isUpdate = activity.type === 'update';
                  const isDelete = activity.type === 'delete';
                  
                  let cardBg = 'bg-blue-50/50 border-blue-100 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900/30';
                  let iconBg = 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
                  let ActionIcon = Info;

                  if (isCreate) {
                    cardBg = 'bg-emerald-50/50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/30';
                    iconBg = 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
                    ActionIcon = UserPlus;
                  } else if (isUpdate) {
                    cardBg = 'bg-amber-50/50 border-amber-100 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/30';
                    iconBg = 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
                    ActionIcon = FileText;
                  } else if (isDelete) {
                    cardBg = 'bg-rose-50/50 border-rose-100 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/30';
                    iconBg = 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400';
                    ActionIcon = AlertCircle;
                  }

                  return (
                    <div key={activity.id} className="relative flex flex-col gap-2">
                      {/* Timeline circle dot node */}
                      <div className="absolute -left-[30px] sm:-left-[41px] top-1.5 flex items-center justify-center">
                        <div className={`w-8 h-8 rounded-full border-4 border-white dark:border-brand-900 flex items-center justify-center shadow-xs ${iconBg}`}>
                          <ActionIcon className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Timeline time headers */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <span>{new Date(activity.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span>•</span>
                        <span>{new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {/* Soft colored chronological horizontal card */}
                      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all ${cardBg}`}>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            {activity.message}
                          </p>
                          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
                            Triggered by <span className="font-semibold text-slate-500 dark:text-slate-400">{activity.user}</span>
                          </span>
                        </div>

                        {/* Location-like detail metadata row tag */}
                        <div className="flex items-center gap-1 text-xs text-slate-400 bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-brand-850/60 px-3 py-1 rounded-lg">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>Portal Event</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

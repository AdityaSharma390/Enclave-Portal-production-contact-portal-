import React from 'react';
import { User, Shield, Mail, Calendar, ShieldCheck } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import { getInitials, getAvatarColor, formatDate } from '../utils/helpers.js';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-800 dark:text-white">
          My Account Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          View your credentials and workspace permissions
        </p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-brand-800/40">
        {/* Banner strip */}
        <div className="h-32 bg-radial from-brand-500 to-brand-700 relative"></div>

        {/* Profile Card body */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 mb-6">
            <div
              className="flex items-center justify-center w-24 h-24 rounded-full font-bold text-white text-3xl shadow-lg border-4 border-white dark:border-brand-900"
              style={{ backgroundColor: getAvatarColor(user.fullName) }}
            >
              {getInitials(user.fullName)}
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white truncate">
                {user.fullName}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                <span className="text-xs font-semibold text-slate-400">
                  Account Member
                </span>
                <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  user.role === 'Admin' 
                    ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20' 
                    : 'text-slate-500 bg-slate-100 border border-slate-200 dark:bg-brand-950 dark:border-brand-800 dark:text-slate-400'
                }`}>
                  {user.role === 'Admin' ? 'Admin Root' : 'Standard User'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-200/50 dark:border-brand-800/40 pt-6">
            {/* Full Name */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 dark:bg-brand-950 rounded-lg text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">
                  Account Name
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user.fullName}
                </span>
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 dark:bg-brand-950 rounded-lg text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">
                  Email Address
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user.email}
                </span>
              </div>
            </div>

            {/* Role scope */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 dark:bg-brand-950 rounded-lg text-slate-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">
                  Workspace Role
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Date Joined */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 dark:bg-brand-950 rounded-lg text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block uppercase">
                  Joined Date
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <div className="glass-card max-w-md p-8 rounded-2xl flex flex-col items-center shadow-xl">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 mb-6 dark:bg-red-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold font-display text-slate-800 dark:text-white leading-none">
          404
        </h1>
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mt-3">
          Page Not Found
        </h2>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
          The security root was unable to verify the path or the resources have been moved.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center gap-1.5 bg-brand-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-brand-600 transition-colors shadow-md shadow-brand-500/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

import React from 'react';

const SkeletonPulse = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-brand-800 rounded ${className}`}></div>
);

export const CardSkeleton = () => (
  <div className="p-5 rounded-xl border border-slate-200/50 bg-white dark:bg-brand-900 dark:border-brand-800/40 shadow-sm flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <SkeletonPulse className="w-10 h-10 rounded-lg" />
      <div className="flex-1 flex flex-col gap-2">
        <SkeletonPulse className="w-24 h-4" />
        <SkeletonPulse className="w-16 h-3" />
      </div>
    </div>
    <SkeletonPulse className="w-full h-4 mt-2" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full overflow-hidden border border-slate-200/50 rounded-xl dark:border-brand-800/40 bg-white dark:bg-brand-900">
    <div className="p-4 border-b border-slate-200 dark:border-brand-800 flex justify-between">
      <SkeletonPulse className="w-32 h-6" />
      <SkeletonPulse className="w-24 h-6" />
    </div>
    <div className="p-4 flex flex-col gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-3 flex-1">
            <SkeletonPulse className="w-8 h-8 rounded-full" />
            <div className="flex flex-col gap-2 flex-1 max-w-[200px]">
              <SkeletonPulse className="w-full h-4" />
              <SkeletonPulse className="w-2/3 h-3" />
            </div>
          </div>
          <SkeletonPulse className="w-24 h-4" />
          <SkeletonPulse className="w-32 h-4" />
          <div className="flex gap-2">
            <SkeletonPulse className="w-8 h-8 rounded" />
            <SkeletonPulse className="w-8 h-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="p-6 rounded-xl border border-slate-200/50 bg-white dark:bg-brand-900 dark:border-brand-800/40 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <SkeletonPulse className="w-20 h-4" />
          <SkeletonPulse className="w-12 h-8" />
        </div>
        <SkeletonPulse className="w-12 h-12 rounded-xl" />
      </div>
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="p-6 rounded-xl border border-slate-200/50 bg-white dark:bg-brand-900 dark:border-brand-800/40 max-w-2xl flex flex-col gap-6">
    <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-100 dark:border-brand-800 pb-5">
      <SkeletonPulse className="w-20 h-20 rounded-full" />
      <div className="flex flex-col gap-2 w-full sm:w-auto items-center sm:items-start">
        <SkeletonPulse className="w-36 h-6" />
        <SkeletonPulse className="w-24 h-4" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <SkeletonPulse className="w-16 h-3" />
          <SkeletonPulse className="w-full h-10" />
        </div>
      ))}
    </div>
  </div>
);

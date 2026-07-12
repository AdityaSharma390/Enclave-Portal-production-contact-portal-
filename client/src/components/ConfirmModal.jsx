import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden bg-white rounded-xl shadow-2xl dark:bg-brand-900 border border-slate-200/50 dark:border-brand-800/40 animate-slide-up">
        {/* Header Banner */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-brand-800">
          <div className="flex items-center gap-2">
            {isDanger && (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            )}
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-brand-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {message}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-brand-950 border-t border-slate-100 dark:border-brand-800">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 dark:bg-brand-900 dark:border-brand-800 dark:text-slate-300 dark:hover:bg-brand-800 transition-colors duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 shadow-md ${
              isDanger
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/10'
                : 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/10'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ShieldAlert, ShieldCheck, AlertCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors([]);
    setSuccess('');
    setIsLoading(true);

    try {
      await register(fullName, email, password, role);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      console.error(err);
      const resData = err.response?.data;
      if (resData?.errors) {
        setFieldErrors(resData.errors);
      } else {
        setError(resData?.message || 'Failed to register account. Please check inputs.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (fieldName) => {
    return fieldErrors.find((fe) => fe.field === fieldName)?.message;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-radial from-slate-100 to-slate-200 dark:from-brand-950 dark:to-brand-900 transition-colors duration-300">
      <div className="w-full max-w-md glass-card rounded-2xl overflow-hidden p-8 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500 text-white shadow-lg mb-3">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-800 dark:text-white">
            Create Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sign up to access your Enclave workspace
          </p>
        </div>

        {/* Errors */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-950/20 dark:text-red-400 border border-red-200/30">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 mb-6 text-sm text-green-600 bg-green-50 rounded-lg dark:bg-green-950/20 dark:text-green-400 border border-green-200/30">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                required
                className={`w-full pl-10 glass-input ${
                  getFieldError('fullName') ? 'border-red-500 dark:border-red-500' : ''
                }`}
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {getFieldError('fullName') && (
              <p className="text-xs text-red-500 mt-1">{getFieldError('fullName')}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                className={`w-full pl-10 glass-input ${
                  getFieldError('email') ? 'border-red-500 dark:border-red-500' : ''
                }`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {getFieldError('email') && (
              <p className="text-xs text-red-500 mt-1">{getFieldError('email')}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                required
                className={`w-full pl-10 glass-input ${
                  getFieldError('password') ? 'border-red-500 dark:border-red-500' : ''
                }`}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {getFieldError('password') && (
              <p className="text-xs text-red-500 mt-1">{getFieldError('password')}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Account Workspace Role
            </label>
            <div className="flex gap-4 p-1 bg-slate-100 dark:bg-brand-950 rounded-lg">
              <button
                type="button"
                onClick={() => setRole('User')}
                disabled={isLoading}
                className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all duration-200 ${
                  role === 'User'
                    ? 'bg-white dark:bg-brand-900 text-brand-500 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Standard User
              </button>
              <button
                type="button"
                onClick={() => setRole('Admin')}
                disabled={isLoading}
                className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  role === 'Admin'
                    ? 'bg-white dark:bg-brand-900 text-amber-500 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Workspace Admin
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 shadow-md shadow-brand-500/10 transition-colors duration-200 disabled:bg-brand-400 mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Initialize Account'
            )}
          </button>
        </form>

        {/* Switch back */}
        <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-brand-800/40 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Already have an Enclave account?{' '}
            <Link
              to="/login"
              className="text-brand-500 hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

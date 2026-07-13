import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirection path after successful authentication
  const from = location.state?.from?.pathname || '/dashboard';
  const queryParams = new URLSearchParams(location.search);
  const sessionExpired = queryParams.get('expired');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await login(email, password);
      setSuccess('Access Granted. Opening Enclave...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    // Auto-trigger authentication
    setIsLoading(true);
    setTimeout(async () => {
      try {
        await login(demoEmail, demoPassword);
        setSuccess('Access Granted. Opening Enclave...');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 800);
      } catch (err) {
        console.error(err);
        setError('Connection failed. Please submit manually.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative cyber ambient glowing shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden p-8 shadow-2xl shadow-black/80 relative z-10 animate-slide-up">
        {/* Header branding like enclave.io */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 text-white shadow-lg shadow-brand-500/20 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center justify-center gap-1.5">
            Enclave Portal
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-semibold">
            Zero Trust Authentication
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            Workspace Demo Center
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleAutofill('admin@enclave.com', 'password123')}
              disabled={isLoading}
              className="py-2 px-3 text-xs font-semibold bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/15 rounded-lg transition-all text-center flex flex-col items-center gap-0.5"
            >
              <span className="text-[10px] uppercase font-bold text-brand-500">Admin Mode</span>
              <span>Autofill Session</span>
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('user@enclave.com', 'password123')}
              disabled={isLoading}
              className="py-2 px-3 text-xs font-semibold bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/15 rounded-lg transition-all text-center flex flex-col items-center gap-0.5"
            >
              <span className="text-[10px] uppercase font-bold text-teal-500">User Mode</span>
              <span>Autofill Session</span>
            </button>
          </div>
        </div>

        {/* Notices */}
        {sessionExpired && !error && (
          <div className="flex items-center gap-2 p-3 mb-5 text-xs text-amber-400 bg-amber-950/20 rounded-lg border border-amber-500/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Session expired. Please authenticate.</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 mb-5 text-xs text-red-400 bg-red-950/20 rounded-lg border border-red-500/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 mb-5 text-xs text-teal-400 bg-teal-950/20 rounded-lg border border-teal-500/20">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Identity Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Security Key
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-1.5 py-2.5 px-4 rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-[0.98] transition-all disabled:bg-slate-800 disabled:text-slate-600 disabled:scale-100"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                Authenticate
              </>
            )}
          </button>
        </form>

        {/* Footer redirects */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Need a custom account?{' '}
            <Link
              to="/register"
              className="text-teal-400 hover:underline font-bold"
            >
              Sign Up Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

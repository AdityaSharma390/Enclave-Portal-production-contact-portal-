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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-slate-800 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative clean ambient gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl overflow-hidden p-8 shadow-xl relative z-10 animate-slide-up">
        {/* Header branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/10 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
            Enclave Portal
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-semibold">
            Zero Trust Authentication
          </p>
        </div>

        {/* Demo Credentials Box - Updated for dev1973sharma@gmail.com */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            Workspace Demo Center
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleAutofill('dev1973sharma@gmail.com', 'password123')}
              disabled={isLoading}
              className="py-2.5 px-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-center flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/10"
            >
              <span>Autofill Demo Account (dev1973sharma@gmail.com)</span>
            </button>
            <div className="text-[10px] text-center text-slate-400 font-medium">
              Demo Admin Mode • password: <span className="font-mono">password123</span>
            </div>
          </div>
        </div>

        {/* Notices */}
        {sessionExpired && !error && (
          <div className="flex items-center gap-2 p-3 mb-5 text-xs text-amber-700 bg-amber-50 rounded-lg border border-amber-200/50">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Session expired. Please authenticate.</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 mb-5 text-xs text-red-700 bg-red-50 rounded-lg border border-red-200/50">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 mb-5 text-xs text-blue-700 bg-blue-50 rounded-lg border border-blue-200/50">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
              Identity Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
              Security Key
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
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
            className="w-full flex justify-center items-center gap-1.5 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                Authenticate
              </>
            )}
          </button>
        </form>

        {/* Footer redirects */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Need a custom account?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-bold"
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

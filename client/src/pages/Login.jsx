import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';
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
    e.preventDefault();
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white transition-colors duration-300 relative overflow-hidden font-sans">
      <div className="w-full max-w-md overflow-hidden p-6 animate-slide-up flex flex-col">
        {/* Header branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#dffe00] hover:underline font-bold transition-all ml-0.5"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Notices */}
        {sessionExpired && !error && (
          <div className="flex items-center gap-2 p-3 mb-5 text-xs text-amber-400 bg-amber-950/20 rounded-xl border border-amber-500/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Session expired. Please authenticate.</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 mb-5 text-xs text-red-400 bg-red-950/20 rounded-xl border border-red-500/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 mb-5 text-xs text-[#dffe00] bg-[#dffe00]/10 rounded-xl border border-[#dffe00]/20">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Inputs - Pill Shaped (#1c1c1e) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="email"
                required
                className="w-full px-6 py-4 bg-[#1c1c1e] text-white border-0 focus:outline-none focus:ring-1 focus:ring-[#dffe00] rounded-full placeholder-slate-500 text-sm transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full pl-6 pr-12 py-4 bg-[#1c1c1e] text-white border-0 focus:outline-none focus:ring-1 focus:ring-[#dffe00] rounded-full placeholder-slate-500 text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-4 px-6 rounded-full bg-[#dffe00] hover:bg-[#cbe600] text-black font-extrabold text-sm active:scale-[0.98] transition-all disabled:bg-slate-800 disabled:text-slate-600 disabled:scale-100 mt-6 shadow-md shadow-[#dffe00]/5"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Continue'
            )}
          </button>
        </form>

        {/* Terms of use */}
        <div className="mt-8 text-center text-slate-500 text-[10px] leading-relaxed">
          clicking continue you agree to enclave
          <br />
          <span className="text-[#dffe00] underline font-bold cursor-pointer mx-1">Terms of use</span>
          and
          <span className="text-[#dffe00] underline font-bold cursor-pointer mx-1">Privacy policy</span>
        </div>
      </div>
    </div>
  );
};

export default Login;

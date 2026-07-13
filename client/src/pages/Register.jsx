import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setSuccess('Registration successful! Opening dashboard...');
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white transition-colors duration-300 relative overflow-hidden font-sans">
      <div className="w-full max-w-md overflow-hidden p-6 animate-slide-up flex flex-col">
        {/* Header branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#dffe00] hover:underline font-bold transition-all ml-0.5"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Notices */}
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

        {/* Register Inputs - Pill Shaped (#1c1c1e) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              required
              className={`w-full px-6 py-4 bg-[#1c1c1e] text-white border-0 focus:outline-none focus:ring-1 focus:ring-[#dffe00] rounded-full placeholder-slate-500 text-sm transition-all ${
                getFieldError('fullName') ? 'ring-1 ring-red-500' : ''
              }`}
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
            />
            {getFieldError('fullName') && (
              <p className="text-[10px] text-red-500 mt-1 pl-4">{getFieldError('fullName')}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              required
              className={`w-full px-6 py-4 bg-[#1c1c1e] text-white border-0 focus:outline-none focus:ring-1 focus:ring-[#dffe00] rounded-full placeholder-slate-500 text-sm transition-all ${
                getFieldError('email') ? 'ring-1 ring-red-500' : ''
              }`}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            {getFieldError('email') && (
              <p className="text-[10px] text-red-500 mt-1 pl-4">{getFieldError('email')}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className={`w-full pl-6 pr-12 py-4 bg-[#1c1c1e] text-white border-0 focus:outline-none focus:ring-1 focus:ring-[#dffe00] rounded-full placeholder-slate-500 text-sm transition-all ${
                  getFieldError('password') ? 'ring-1 ring-red-500' : ''
                }`}
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
            {getFieldError('password') && (
              <p className="text-[10px] text-red-500 mt-1 pl-4">{getFieldError('password')}</p>
            )}
          </div>

          {/* Role selector switch */}
          <div>
            <div className="flex gap-2 p-1.5 bg-[#1c1c1e] rounded-full">
              <button
                type="button"
                onClick={() => setRole('User')}
                disabled={isLoading}
                className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-full transition-all duration-200 ${
                  role === 'User'
                    ? 'bg-[#dffe00] text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Standard User
              </button>
              <button
                type="button"
                onClick={() => setRole('Admin')}
                disabled={isLoading}
                className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  role === 'Admin'
                    ? 'bg-[#dffe00] text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
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
          clicking create account you agree to enclave
          <br />
          <span className="text-[#dffe00] underline font-bold cursor-pointer mx-1">Terms of use</span>
          and
          <span className="text-[#dffe00] underline font-bold cursor-pointer mx-1">Privacy policy</span>
        </div>
      </div>
    </div>
  );
};

export default Register;

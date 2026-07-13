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

        {/* Or sign up with divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-black px-4 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              or sign up with
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            className="flex justify-center items-center py-3.5 border border-slate-800 hover:border-slate-700 bg-transparent rounded-xl transition-all"
            onClick={() => console.log('Google Auth active')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.355 0 3.39 2.673 1.473 6.564l3.793 3.201z"
              />
              <path
                fill="#4285F4"
                d="M16.04 15.345c-1.077.732-2.436 1.164-4.04 1.164-2.927 0-5.414-1.982-6.3-4.654L1.907 15.06C3.89 19.127 8.09 22 13 22c3.255 0 6.182-1.09 8.218-3L16.04 15.345z"
              />
              <path
                fill="#FBBC05"
                d="M5.7 11.855a7.043 7.043 0 010-2.09L1.907 6.564a11.97 11.97 0 000 8.491L5.7 11.855z"
              />
              <path
                fill="#34A853"
                d="M21.218 8.091H12v4.227h5.182c-.227 1.191-.9 2.2-1.91 2.873l5.182 3.827C23.473 16.145 24 12.873 24 9c0-.318-.027-.627-.082-.909H12z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="flex justify-center items-center py-3.5 border border-slate-800 hover:border-slate-700 bg-transparent rounded-xl transition-all"
            onClick={() => console.log('Apple Auth active')}
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12.03 5.4c.83 0 1.95-.73 2.5-1.4.52-.63.85-1.57.85-2.5 0-.13-.02-.26-.04-.36-.93.04-2.06.63-2.73 1.4-.55.6-.96 1.57-.96 2.5 0 .15.02.28.05.36zM17.47 18.24c.73-1.05 1.63-2.6 1.63-4.14 0-2.83-1.95-4.32-3.88-4.32-1.5 0-2.7 1.02-3.46 1.02-.75 0-1.85-1-3.23-1-2.4 0-4.66 2-4.66 5.6 0 3.32 2.14 8.7 4.54 8.7 1.16 0 1.83-.8 3.16-.8 1.3 0 1.95.8 3.16.8 2 0 4.14-4.8 4.74-6z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex justify-center items-center py-3.5 border border-slate-800 hover:border-slate-700 bg-transparent rounded-xl transition-all"
            onClick={() => console.log('Facebook Auth active')}
          >
            <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>
        </div>

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

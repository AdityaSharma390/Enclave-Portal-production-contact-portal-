import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getUserProfile } from '../services/authService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check token validity on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('enclave_token');
      if (token) {
        try {
          const res = await getUserProfile();
          setUser(res.user);
        } catch (error) {
          console.error('Session verification failed on mount:', error);
          localStorage.removeItem('enclave_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      localStorage.setItem('enclave_token', res.token);
      setUser(res.user);
      return res;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, password, role) => {
    setLoading(true);
    try {
      const res = await registerUser(fullName, email, password, role);
      localStorage.setItem('enclave_token', res.token);
      setUser(res.user);
      return res;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('enclave_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

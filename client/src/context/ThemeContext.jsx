import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Force theme to be strictly 'light' to match the third picture's theme
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    localStorage.setItem('enclave_theme', 'light');
  }, []);

  const toggleTheme = () => {
    // Disable dark mode toggle - keep the page strictly in the light theme
    console.log('Dark mode is disabled for this branding theme.');
  };

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

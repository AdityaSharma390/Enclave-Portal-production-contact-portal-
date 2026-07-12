import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

import Layout from './components/Layout.jsx';
import Protected from './components/Protected.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ContactsList from './pages/ContactsList.jsx';
import ContactDetails from './pages/ContactDetails.jsx';
import ContactForm from './pages/ContactForm.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Authentication Pathways */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Workspace Layout Channels */}
            <Route
              path="/"
              element={
                <Protected>
                  <Layout />
                </Protected>
              }
            >
              {/* Redirect root to dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="contacts" element={<ContactsList />} />
              <Route path="contacts/new" element={<ContactForm />} />
              <Route path="contacts/:id" element={<ContactDetails />} />
              <Route path="contacts/:id/edit" element={<ContactForm />} />
              <Route path="profile" element={<Profile />} />
              
              {/* Fallback 404 Route within protected layout */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

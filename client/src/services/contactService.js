import API from './api.js';

export const getContacts = async (params = {}) => {
  const response = await API.get('/contact', { params });
  return response.data;
};

export const getContactById = async (id) => {
  const response = await API.get(`/contact/${id}`);
  return response.data;
};

export const createContact = async (formData) => {
  const response = await API.post('/contact', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateContact = async (id, formData) => {
  const response = await API.put(`/contact/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteContact = async (id) => {
  const response = await API.delete(`/contact/${id}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await API.get('/contact/dashboard-stats');
  return response.data;
};

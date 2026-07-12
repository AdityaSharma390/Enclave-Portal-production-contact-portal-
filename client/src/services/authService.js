import API from './api.js';

export const loginUser = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (fullName, email, password, role) => {
  const response = await API.post('/auth/register', { fullName, email, password, role });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await API.get('/auth/profile');
  return response.data;
};

import { api } from '../../../lib/axios.js';

export const fetchCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data.user;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

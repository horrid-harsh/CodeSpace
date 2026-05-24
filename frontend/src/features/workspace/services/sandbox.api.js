import { api } from '../../../lib/axios.js';

export const startSandbox = async () => {
  const response = await api.post('/sandbox/start');
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/sandbox/health');
  return response.data;
};

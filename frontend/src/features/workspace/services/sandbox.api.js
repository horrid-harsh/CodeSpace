import { api } from '../../../lib/axios.js';

export const createProject = async (title) => {
  const response = await api.post('/sandbox/project', { title });
  return response.data;
};

export const fetchProjects = async () => {
  const response = await api.get('/sandbox/projects');
  return response.data;
};

export const startSandbox = async (projectId) => {
  const response = await api.post('/sandbox/start', { projectId });
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/sandbox/health');
  return response.data;
};

import { api } from './api';

export const createCleaningRequest = async (payload) => {
  return api.post('/cleaning-requests', payload);
};

export const fetchMyCleaningRequests = async () => {
  return api.get('/cleaning-requests/my');
};

export const createConstructionRequest = async (payload) => {
  return api.post('/construction-requests', payload);
};

export const fetchMyConstructionRequests = async () => {
  return api.get('/construction-requests/my');
};
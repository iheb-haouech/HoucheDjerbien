import { api } from './api';

export const fetchListings = async () => {
  return api.get('/listings');
};

export const fetchListingById = async (id) => {
  return api.get(`/listings/${id}`);
};

export const createListing = async (payload) => {
  return api.post('/listings', payload);
};

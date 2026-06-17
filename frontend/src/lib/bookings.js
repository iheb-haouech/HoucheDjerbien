import { api } from './api';

export const createBooking = async (payload) => {
  return api.post('/bookings', payload);
};

export const fetchMyBookings = async () => {
  return api.get('/bookings/my');
};
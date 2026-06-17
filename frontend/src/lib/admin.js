import { api } from './api';

export const fetchAdminBookings = async () => api.get('/admin/bookings');

export const createManualBooking = async (payload) => api.post('/admin/manual-booking', payload);

export const updateAdminBookingStatus = async (id, status) => (
  api.patch(`/admin/bookings/${id}/status`, { status })
);

export const deleteAdminBooking = async (id) => api.delete(`/admin/bookings/${id}`);

export const fetchAdminCleaningRequests = async () => api.get('/cleaning-requests');

export const fetchAdminConstructionRequests = async () => api.get('/construction-requests');

import { api, setToken, clearToken, getToken } from './api';

export const loginUser = async ({ email, password }) => {
  const data = await api.post('/auth/login', { email, password });
  setToken(data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const registerUser = async ({
  firstName,
  lastName,
  phone,
  address,
  email,
  password,
}) => {
  const data = await api.post('/auth/register', {
    firstName,
    lastName,
    phone,
    address,
    email,
    password,
  });

  setToken(data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const requestPasswordReset = async (email) => {
  const response = await fetch('http://localhost:5000/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to send reset link.');
  }

  return data;
};

export const resetPassword = async (token, password) => {
  const response = await fetch('http://localhost:5000/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Unable to reset password.');
  }

  return data;
};

export const logoutUser = () => {
  clearToken();
  localStorage.removeItem('user');
};

export const getStoredUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export const getStoredToken = () => {
  return getToken();
};
import apiClient from './client';

export const userService = {
  getUsers: (params) => apiClient.get('/users/', { params }),
  createUser: (data) => apiClient.post('/users/', data),
  getMe: () => apiClient.get('/users/me'),
  deleteUser: (userId) => apiClient.delete(`/users/${userId}`),
  createSession: (token) => apiClient.post('/users/session', { session_token: token }),
  deleteSession: () => apiClient.delete('/users/session'),
};

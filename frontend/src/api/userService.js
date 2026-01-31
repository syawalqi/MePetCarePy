import apiClient from './client';

export const userService = {
  getUsers: (params) => apiClient.get('/users/', { params }),
  createUser: (data) => apiClient.post('/users/', data),
  getMe: () => apiClient.get('/users/me'),
};

import apiClient from './client';

export const ownerService = {
  getOwners: (params) => apiClient.get('/owners/', { params }),
  getOwner: (id) => apiClient.get(`/owners/${id}`),
  createOwner: (data) => apiClient.post('/owners/', data),
  updateOwner: (id, data) => apiClient.put(`/owners/${id}`, data),
  deleteOwner: (id) => apiClient.delete(`/owners/${id}`),
  searchOwners: (query) => apiClient.get('/owners/search/', { params: { query } }),
};

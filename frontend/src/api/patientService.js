import apiClient from './client';

export const patientService = {
  getPatients: (params) => apiClient.get('/patients/', { params }),
  getPatient: (id) => apiClient.get(`/patients/${id}`),
  createPatient: (data) => apiClient.post('/patients/', data),
  updatePatient: (id, data) => apiClient.put(`/patients/${id}`, data),
  deletePatient: (id) => apiClient.delete(`/patients/${id}`),
  searchPatients: (query) => apiClient.get('/patients/search/', { params: { query } }),
};

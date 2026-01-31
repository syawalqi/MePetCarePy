import apiClient from './client';

export const medicalRecordService = {
  getPatientHistory: (patientId) => apiClient.get(`/medical-records/patient/${patientId}`),
  createRecord: (data) => apiClient.post('/medical-records/', data),
  updateRecord: (id, data) => apiClient.put(`/medical-records/${id}`, data),
  getRecord: (id) => apiClient.get(`/medical-records/${id}`),
  deleteRecord: (id) => apiClient.delete(`/medical-records/${id}`),
};

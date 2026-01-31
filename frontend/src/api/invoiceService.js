import client from './client';

export const invoiceService = {
  getInvoices: () => client.get('/invoices/'),
  getInvoice: (id) => client.get(`/invoices/${id}`),
  createInvoice: (data) => client.post('/invoices/', data),
  updateStatus: (id, status) => client.patch(`/invoices/${id}/status`, { status }),
  getMonthlyReport: (year, month) => 
    client.get(`/invoices/reports/monthly`, { params: { year, month } }),
  getMonthlyReportPDF: (year, month) => 
    client.get(`/invoices/reports/monthly/pdf`, { 
      params: { year, month },
      responseType: 'blob' 
    }),
};

import React, { useEffect, useState } from 'react';
import { invoiceService } from '../api/invoiceService';

const InvoiceList = ({ patientId }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, [patientId]);

  const loadInvoices = async () => {
    try {
      // In a real app, we'd filter by patientId on the server
      const response = await invoiceService.getInvoices();
      const filtered = response.data.filter(inv => inv.patient_id === parseInt(patientId));
      setInvoices(filtered);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id) => {
    if (!window.confirm("Mark this invoice as PAID?")) return;
    try {
      await invoiceService.updateStatus(id, "PAID");
      loadInvoices();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div>Loading billing history...</div>;

  return (
    <div className="invoice-list mt-4">
      <h3>Billing History</h3>
      {invoices.length === 0 ? (
        <p className="text-muted">No invoices found for this patient.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td>#{inv.id}</td>
                  <td>{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td>${inv.total_amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${inv.status === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    {inv.status === 'UNPAID' && (
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleMarkAsPaid(inv.id)}
                      >
                        Accept Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;

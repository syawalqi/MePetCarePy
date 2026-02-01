import React, { useEffect, useState } from 'react';
import { invoiceService } from '../api/invoiceService';
import { CreditCard, Calendar, CheckCircle2, Clock } from 'lucide-react';

const InvoiceList = ({ patientId }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, [patientId]);

  const loadInvoices = async () => {
    try {
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

  if (loading) return (
    <div className="py-3 text-center text-muted small">
      <div className="spinner-border spinner-border-sm me-2" role="status"></div>
      Loading history...
    </div>
  );

  return (
    <div className="invoice-list">
      <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <CreditCard size={18} />
        <span>Billing History</span>
      </h5>
      
      {invoices.length === 0 ? (
        <div className="p-4 bg-light rounded text-center small text-muted">
          No previous invoices found for this patient.
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {invoices.map(inv => (
            <div key={inv.id} className="card shadow-none border bg-light rounded-3">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <div className="fw-bold mb-0">Invoice #{inv.id}</div>
                    <div className="text-muted small d-flex align-items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(inv.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="h5 fw-bold mb-0 text-primary">
                    ${inv.total_amount.toFixed(2)}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    {inv.status === 'PAID' ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle d-flex align-items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>Paid</span>
                      </span>
                    ) : (
                      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle d-flex align-items-center gap-1">
                        <Clock size={12} />
                        <span>Unpaid</span>
                      </span>
                    )}
                  </div>
                  
                  {inv.status === 'UNPAID' && (
                    <button 
                      className="btn btn-sm btn-success px-3 shadow-sm"
                      onClick={() => handleMarkAsPaid(inv.id)}
                    >
                      Accept Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
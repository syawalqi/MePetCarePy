import React, { useEffect, useState } from 'react';
import { invoiceService } from '../api/invoiceService';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Calendar, CheckCircle2, Clock, FileText, Trash2 } from 'lucide-react';

const InvoiceList = ({ patientId }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    loadInvoices();
  }, [patientId]);

  const loadInvoices = async () => {
    try {
      const response = await invoiceService.getInvoices();
      const filtered = response.data.filter(inv => inv.patient_id === parseInt(patientId));
      // Sort by newest first
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setInvoices(filtered);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id) => {
    if (!window.confirm("Tandai tagihan ini sebagai SUDAH DIBAYAR?")) return;
    try {
      await invoiceService.updateStatus(id, "PAID");
      loadInvoices();
    } catch (error) {
      alert("Gagal memperbarui status pembayaran.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("APAKAH ANDA YAKIN? Ini akan menghapus data tagihan secara permanen.")) return;
    try {
      await invoiceService.deleteInvoice(id);
      loadInvoices();
    } catch (error) {
      alert("Gagal menghapus tagihan. Akses terbatas untuk Super Admin.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  // Roles that can update status (CRU)
  const canUpdate = ['SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN'].includes(profile?.role);
  const isSuperAdmin = profile?.role === 'SUPERADMIN';

  if (loading) return (
    <div className="py-5 text-center text-muted small">
      <div className="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>
      Memuat riwayat tagihan...
    </div>
  );

  return (
    <div className="invoice-list">
      <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark">
        <CreditCard size={20} className="text-primary" />
        <span>Riwayat Transaksi</span>
      </h5>

      {invoices.length === 0 ? (
        <div className="p-5 bg-light rounded-3 text-center border border-dashed">
          <div className="text-muted opacity-50 mb-2">
            <FileText size={32} />
          </div>
          <p className="text-muted mb-0 small">Belum ada tagihan untuk pasien ini.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {invoices.map(inv => (
            <div key={inv.id} className="card shadow-sm border-0 bg-white hover-shadow transition-all">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <div className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                      Tagihan #{inv.id}
                      {isSuperAdmin && (
                        <button 
                          onClick={() => handleDelete(inv.id)}
                          className="btn btn-link text-danger p-0 border-0"
                          title="Hapus Tagihan"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="text-muted x-small d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                      <Calendar size={12} />
                      <span>{new Date(inv.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{new Date(inv.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <div className="h5 fw-bold mb-0 text-primary">
                    {formatCurrency(inv.total_amount)}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light">
                  <div>
                    {inv.status === 'PAID' ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill d-flex align-items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>Lunas</span>
                      </span>
                    ) : (
                      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1 rounded-pill d-flex align-items-center gap-1">
                        <Clock size={12} />
                        <span>Belum Lunas</span>
                      </span>
                    )}
                  </div>

                  {inv.status === 'UNPAID' && canUpdate && (
                    <button
                      className="btn btn-sm btn-success px-3 shadow-sm rounded-pill font-weight-medium"
                      onClick={() => handleMarkAsPaid(inv.id)}
                    >
                      Terima Pembayaran
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
import React, { useState } from 'react';
import { invoiceService } from '../api/invoiceService';
import { Plus, Trash2, Save, FileText, ShoppingBag, X } from 'lucide-react';

const InvoiceForm = ({ patientId, medicalRecordId, onSuccess }) => {
  const [items, setItems] = useState([{ description: '', unit_price_at_billing: 0, quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddItem = () => {
    setItems([...items, { description: '', unit_price_at_billing: 0, quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.unit_price_at_billing * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!navigator.onLine) {
      alert("Mode Offline: Anda tidak dapat membuat tagihan saat ini.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const payload = {
        patient_id: patientId,
        medical_record_id: medicalRecordId || null,
        items: items.map(item => ({
          ...item,
          unit_price_at_billing: parseFloat(item.unit_price_at_billing)
        }))
      };
      await invoiceService.createInvoice(payload);
      if (onSuccess) onSuccess();
      setItems([{ description: '', unit_price_at_billing: 0, quantity: 1 }]);
    } catch (err) {
      setError(err.response?.data?.detail || "Gagal membuat tagihan.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  return (
    <div className="card shadow-sm border-0 overflow-hidden">
      <div className="card-header bg-white border-bottom py-3">
        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <FileText size={20} className="text-primary" />
          <span>Buat Tagihan Baru</span>
        </h5>
      </div>

      <div className="card-body p-4 bg-light">
        {error && <div className="alert alert-danger mb-4 shadow-sm border-0">{JSON.stringify(error)}</div>}

        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-column gap-3 mb-4">
            {items.map((item, index) => (
              <div key={index} className="bg-white p-3 rounded-3 shadow-sm border border-light position-relative group-hover-visible">
                {/* Remove Button (Top Right) */}
                {items.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-link text-muted p-1 position-absolute top-0 end-0 mt-2 me-2 hover-text-danger transition-colors"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <X size={18} />
                  </button>
                )}

                <div className="row g-3">
                  {/* Description Input */}
                  <div className="col-12">
                    <label className="form-label x-small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '0.7rem' }}>
                      Deskripsi Item #{index + 1}
                    </label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-light border-end-0 text-muted"><ShoppingBag size={14} /></span>
                      <input
                        type="text"
                        className="form-control form-control-sm border-start-0 ps-1"
                        placeholder="Nama obat atau layanan..."
                        value={item.description}
                        onChange={(e) => handleChange(index, 'description', e.target.value)}
                        required
                        autoFocus={index === items.length - 1 && items.length > 1}
                      />
                    </div>
                  </div>

                  {/* Price Input */}
                  <div className="col-7">
                    <label className="form-label x-small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '0.7rem' }}>Harga Satuan</label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-light border-end-0 text-muted" style={{ fontSize: '0.8rem' }}>Rp</span>
                      <input
                        type="number"
                        step="1"
                        className="form-control form-control-sm border-start-0 ps-1 fw-medium"
                        value={item.unit_price_at_billing}
                        onChange={(e) => handleChange(index, 'unit_price_at_billing', e.target.value)}
                        required
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Qty Input */}
                  <div className="col-5">
                    <label className="form-label x-small text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '0.7rem' }}>Jumlah</label>
                    <input
                      type="number"
                      className="form-control form-control-sm text-center fw-medium"
                      value={item.quantity}
                      onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value))}
                      required
                      min="1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          <button
            type="button"
            className="btn btn-outline-primary w-100 border-dashed py-2 mb-4 d-flex align-items-center justify-content-center gap-2 hover-bg-primary-subtle transition-all"
            onClick={handleAddItem}
          >
            <Plus size={16} />
            <span>Tambah Item Lain</span>
          </button>

          {/* Footer Actions */}
          <div className="bg-white p-3 rounded-3 shadow-sm border border-light">
            <div className="d-flex justify-content-between align-items-end mb-3">
              <span className="text-muted small">Total yang harus dibayar</span>
              <div className="h4 fw-bold text-primary mb-0">{formatCurrency(calculateTotal())}</div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              disabled={loading || !navigator.onLine}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>{!navigator.onLine ? "Mode Offline (Baca Saja)" : "Simpan Tagihan"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
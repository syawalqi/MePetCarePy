import React, { useState } from 'react';
import { invoiceService } from '../api/invoiceService';

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
      // Reset form if success
      setItems([{ description: '', unit_price_at_billing: 0, quantity: 1 }]);
      alert("Invoice created successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm p-4">
      <h4 className="mb-4">Create New Invoice</h4>
      {error && <div className="alert alert-danger">{JSON.stringify(error)}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Description</th>
                <th style={{ width: '150px' }}>Price</th>
                <th style={{ width: '100px' }}>Qty</th>
                <th style={{ width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Service/Meds name"
                      value={item.description}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control form-control-sm"
                      value={item.unit_price_at_billing}
                      onChange={(e) => handleChange(index, 'unit_price_at_billing', e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={item.quantity}
                      onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value))}
                      required
                    />
                  </td>
                  <td>
                    {items.length > 1 && (
                      <button 
                        type="button" 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <button type="button" className="btn btn-link btn-sm p-0" onClick={handleAddItem}>
            + Add Another Item
          </button>
          <div className="h5 mb-0">
            Total: ${calculateTotal().toFixed(2)}
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100 mt-4" 
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Invoice"}
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;

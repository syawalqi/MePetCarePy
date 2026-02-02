import React, { useState } from 'react';
import { ownerService } from '../api/ownerService';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

const OwnerForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const submitData = { ...formData };
      if (!submitData.email) delete submitData.email;
      
      await ownerService.createOwner(submitData);
      navigate('/owners');
    } catch (error) {
      console.error('Error creating owner:', error);
      setError('Failed to create owner. Please check the data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      <button onClick={() => navigate(-1)} className="btn btn-link text-muted d-flex align-items-center gap-2 mb-4 p-0">
        <ArrowLeft size={16} />
        <span>Back to Directory</span>
      </button>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <div className="mb-4">
                <h2 className="fw-bold mb-1">Register New Owner</h2>
                <p className="text-muted">Enter contact information for the clinic's new client.</p>
              </div>

              {error && <div className="alert alert-danger small mb-4">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold uppercase">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <User size={18} className="text-muted" />
                    </span>
                    <input 
                      name="full_name" 
                      className="form-control bg-light border-start-0"
                      placeholder="e.g. John Doe"
                      value={formData.full_name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold uppercase">Email Address (Optional)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Mail size={18} className="text-muted" />
                    </span>
                    <input 
                      type="email" 
                      name="email" 
                      className="form-control bg-light border-start-0"
                      placeholder="john@example.com"
                      value={formData.email} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold uppercase">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Phone size={18} className="text-muted" />
                    </span>
                    <input 
                      type="tel"
                      name="phone_number" 
                      className="form-control bg-light border-start-0"
                      placeholder="+62 812..."
                      value={formData.phone_number} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold uppercase">Residential Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 align-items-start pt-2">
                      <MapPin size={18} className="text-muted" />
                    </span>
                    <textarea 
                      name="address" 
                      rows="3"
                      className="form-control bg-light border-start-0"
                      placeholder="Complete street address..."
                      value={formData.address} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary py-2 fw-bold shadow-sm"
                    disabled={loading || !navigator.onLine}
                  >
                    {loading ? 'Mendaftarkan...' : (!navigator.onLine ? 'Mode Offline (Baca Saja)' : 'Daftarkan Pemilik')}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-link text-muted" 
                    onClick={() => navigate('/owners')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerForm;
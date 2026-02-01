import React, { useState } from 'react';
import { patientService } from '../api/patientService';
import { useNavigate, useLocation } from 'react-router-dom';
import { PawPrint, Info, Calendar, User, ArrowLeft, Dog } from 'lucide-react';

const PatientForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialOwnerId = queryParams.get('owner_id') || '';

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    date_of_birth: '',
    owner_id: initialOwnerId,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const submitData = { ...formData };
      if (!submitData.date_of_birth) delete submitData.date_of_birth;
      
      await patientService.createPatient(submitData);
      if (initialOwnerId) {
        navigate(`/owners/${initialOwnerId}`);
      } else {
        navigate('/patients');
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      setError('Failed to create patient. Please check the data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      <button onClick={() => navigate(-1)} className="btn btn-link text-muted d-flex align-items-center gap-2 mb-4 p-0">
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <div className="mb-4">
                <h2 className="fw-bold mb-1">Add New Pet</h2>
                <p className="text-muted">Register a new animal record in the clinic database.</p>
              </div>

              {error && <div className="alert alert-danger small mb-4">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold uppercase">Pet Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <PawPrint size={18} className="text-muted" />
                    </span>
                    <input 
                      name="name" 
                      className="form-control bg-light border-start-0"
                      placeholder="e.g. Buddy"
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold uppercase">Species</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Dog size={18} className="text-muted" />
                      </span>
                      <input 
                        name="species" 
                        className="form-control bg-light border-start-0"
                        placeholder="Dog, Cat..."
                        value={formData.species} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold uppercase">Breed</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Info size={18} className="text-muted" />
                      </span>
                      <input 
                        name="breed" 
                        className="form-control bg-light border-start-0"
                        placeholder="Golden Retriever..."
                        value={formData.breed} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold uppercase">Date of Birth (Approximate)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Calendar size={18} className="text-muted" />
                    </span>
                    <input 
                      type="date" 
                      name="date_of_birth" 
                      className="form-control bg-light border-start-0"
                      value={formData.date_of_birth} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold uppercase">Owner ID</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <User size={18} className="text-muted" />
                    </span>
                    <input 
                      name="owner_id" 
                      className="form-control bg-light border-start-0"
                      value={formData.owner_id} 
                      onChange={handleChange} 
                      required 
                      disabled={!!initialOwnerId} 
                    />
                  </div>
                  {initialOwnerId && <div className="form-text small text-muted">Registering for existing owner #{initialOwnerId}</div>}
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary py-2 fw-bold shadow-sm"
                    disabled={loading}
                  >
                    {loading ? 'Adding Pet...' : 'Register Pet'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-link text-muted" 
                    onClick={() => navigate(-1)}
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

export default PatientForm;
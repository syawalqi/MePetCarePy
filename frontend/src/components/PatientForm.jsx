import React, { useState, useEffect } from 'react';
import { patientService } from '../api/patientService';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="patient-form">
      <h2>Add New Pet</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Pet Name:</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Species:</label>
          <input name="species" value={formData.species} onChange={handleChange} required placeholder="e.g. Dog, Cat" />
        </div>
        <div className="form-group">
          <label>Breed:</label>
          <input name="breed" value={formData.breed} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Owner ID:</label>
          <input name="owner_id" value={formData.owner_id} onChange={handleChange} required disabled={!!initialOwnerId} />
        </div>
        <button type="submit">Add Pet</button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
  );
};

export default PatientForm;

import React, { useState } from 'react';
import { ownerService } from '../api/ownerService';
import { useNavigate } from 'react-router-dom';

const OwnerForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Basic cleaning of empty email string to null if optional
      const submitData = { ...formData };
      if (!submitData.email) delete submitData.email;
      
      await ownerService.createOwner(submitData);
      navigate('/owners');
    } catch (error) {
      console.error('Error creating owner:', error);
      setError('Failed to create owner. Please check the data.');
    }
  };

  return (
    <div className="owner-form">
      <h2>Register Owner</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name:</label>
          <input name="full_name" value={formData.full_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input name="phone_number" value={formData.phone_number} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <textarea name="address" value={formData.address} onChange={handleChange} />
        </div>
        <button type="submit">Register Owner</button>
        <button type="button" onClick={() => navigate('/owners')}>Cancel</button>
      </form>
    </div>
  );
};

export default OwnerForm;

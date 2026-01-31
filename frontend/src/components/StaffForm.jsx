import React, { useState } from 'react';
import { userService } from '../api/userService';
import { useNavigate } from 'react-router-dom';

const StaffForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'SUPPORT_STAFF',
    password: '',
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
      await userService.createUser(formData);
      navigate('/staff');
    } catch (error) {
      console.error("Error creating staff:", error);
      setError(error.response?.data?.detail || "Failed to create staff account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-form">
      <h2>Create New Staff Account</h2>
      {error && <div className="error" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="form-group">
          <label>Full Name:</label><br />
          <input name="full_name" value={formData.full_name} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label>Email:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div className="form-group">
          <label>Assigned Role:</label><br />
          <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '5px' }}>
            <option value="SUPPORT_STAFF">Support Staff</option>
            <option value="VETERINARIAN">Veterinarian</option>
            <option value="ADMINISTRATOR">Administrator</option>
          </select>
        </div>
        <div className="form-group">
          <label>Temporary Password:</label><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" style={{ width: '100%' }} />
          <small>Minimum 6 characters. User should change this after first login.</small>
        </div>
        <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading} className="button primary">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          <button type="button" onClick={() => navigate('/staff')} className="button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;

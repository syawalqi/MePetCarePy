import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { medicalRecordService } from '../api/medicalRecordService';

const MedicalRecordForm = () => {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    weight: '',
    temperature: '',
    heart_rate: '',
    respiration_rate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = { 
        ...formData, 
        patient_id: parseInt(patientId) 
      };
      
      // Clean and convert numeric fields
      ['weight', 'temperature', 'heart_rate', 'respiration_rate'].forEach(field => {
        if (submitData[field] && submitData[field] !== '') {
          submitData[field] = parseFloat(submitData[field]);
        } else {
          delete submitData[field];
        }
      });

      await medicalRecordService.createRecord(submitData);
      navigate(`/patients/${patientId}`);
    } catch (error) {
      console.error("Error creating medical record:", error);
      alert("Failed to save clinical note. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medical-record-form">
      <h2>New Clinical Encounter (SOAP)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <section className="vitals-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '15px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
          <div className="form-group">
            <label>Weight (kg):</label>
            <input name="weight" type="number" step="0.1" value={formData.weight} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Temp (°F):</label>
            <input name="temperature" type="number" step="0.1" value={formData.temperature} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Heart Rate (bpm):</label>
            <input name="heart_rate" type="number" value={formData.heart_rate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Respiration (bpm):</label>
            <input name="respiration_rate" type="number" value={formData.respiration_rate} onChange={handleChange} />
          </div>
        </section>

        <div className="form-group">
          <label><strong>Subjective</strong> (Observations/History):</label>
          <textarea name="subjective" rows="3" value={formData.subjective} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <div className="form-group">
          <label><strong>Objective</strong> (Physical Findings):</label>
          <textarea name="objective" rows="3" value={formData.objective} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <div className="form-group">
          <label><strong>Assessment</strong> (Diagnosis/Differential):</label>
          <textarea name="assessment" rows="3" value={formData.assessment} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <div className="form-group">
          <label><strong>Plan</strong> (Treatment/Medications):</label>
          <textarea name="plan" rows="3" value={formData.plan} onChange={handleChange} style={{ width: '100%' }} />
        </div>

        <div className="form-actions" style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading} className="button primary">
            {loading ? 'Saving...' : 'Save Record'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicalRecordForm;

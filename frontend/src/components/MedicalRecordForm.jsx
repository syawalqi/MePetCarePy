import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { medicalRecordService } from '../api/medicalRecordService';
import { Activity, Clipboard, ArrowLeft, Thermometer, Heart, Wind, Scale } from 'lucide-react';

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
      alert("Failed to save clinical note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-2">
      <button onClick={() => navigate(-1)} className="btn btn-link text-muted d-flex align-items-center gap-2 mb-4 p-0">
        <ArrowLeft size={16} />
        <span>Back to Profile</span>
      </button>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">New SOAP Note</h2>
        <span className="badge bg-primary px-3 py-2">Clinical Encounter</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Vitals Sidebar */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
                  <Activity size={20} />
                  <span>Vital Signs</span>
                </h5>
                
                <div className="row g-3">
                  <div className="col-6 col-lg-12">
                    <label className="form-label small fw-bold uppercase">Weight (kg)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><Scale size={16} /></span>
                      <input name="weight" type="number" step="0.1" inputMode="decimal" className="form-control bg-light border-0" value={formData.weight} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="col-6 col-lg-12">
                    <label className="form-label small fw-bold uppercase">Temp (°F)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><Thermometer size={16} /></span>
                      <input name="temperature" type="number" step="0.1" inputMode="decimal" className="form-control bg-light border-0" value={formData.temperature} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="col-6 col-lg-12">
                    <label className="form-label small fw-bold uppercase">Heart Rate</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><Heart size={16} /></span>
                      <input name="heart_rate" type="number" inputMode="numeric" className="form-control bg-light border-0" placeholder="bpm" value={formData.heart_rate} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="col-6 col-lg-12">
                    <label className="form-label small fw-bold uppercase">Respiration</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><Wind size={16} /></span>
                      <input name="respiration_rate" type="number" inputMode="numeric" className="form-control bg-light border-0" placeholder="bpm" value={formData.respiration_rate} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SOAP Content */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
                  <Clipboard size={20} />
                  <span>Clinical Findings</span>
                </h5>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-uppercase">Subjective <span className="text-muted">(Observations & History)</span></label>
                  <textarea name="subjective" rows="3" className="form-control bg-light border-0" placeholder="Enter owner's complaints or patient history..." value={formData.subjective} onChange={handleChange} />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-uppercase">Objective <span className="text-muted">(Physical Findings)</span></label>
                  <textarea name="objective" rows="3" className="form-control bg-light border-0" placeholder="Enter findings from physical exam..." value={formData.objective} onChange={handleChange} />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-uppercase">Assessment <span className="text-muted">(Diagnosis)</span></label>
                  <textarea name="assessment" rows="3" className="form-control bg-light border-0" placeholder="Enter your assessment or diagnosis..." value={formData.assessment} onChange={handleChange} />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-uppercase">Plan <span className="text-muted">(Treatment)</span></label>
                  <textarea name="plan" rows="3" className="form-control bg-light border-0" placeholder="Enter medications, tests, or follow-up instructions..." value={formData.plan} onChange={handleChange} />
                </div>

                <div className="d-grid pt-3 border-top">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg shadow-sm d-flex justify-content-center align-items-center gap-2"
                    disabled={loading || !navigator.onLine}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Menyimpan Rekam Medis...</span>
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>{ !navigator.onLine ? 'Mode Offline (Baca Saja)' : 'Simpan Rekam Medis' }</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MedicalRecordForm;
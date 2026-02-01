import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { medicalRecordService } from '../api/medicalRecordService';
import { Activity, Clipboard, ArrowLeft, Thermometer, Heart, Wind, Scale, Save, Stethoscope, AlertCircle, FileText } from 'lucide-react';

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

      // Clean up empty vitals
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
      alert("Gagal menyimpan rekam medis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid pb-5">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-link text-muted d-flex align-items-center gap-2 p-0 text-decoration-none">
          <ArrowLeft size={16} />
          <span>Kembali ke Profil Pasien</span>
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Catat Rekam Medis (SOAP)</h2>
          <p className="text-muted mb-0">Isi data pemeriksaan klinis pasien hari ini.</p>
        </div>
        <div className="d-none d-md-block">
          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-2 rounded-pill d-flex align-items-center gap-2">
            <Activity size={16} /> Pemeriksaan Baru
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Left Column: Vitals */}
          <div className="col-lg-4 order-2 order-lg-1">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-light border-bottom px-4 py-3">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 text-dark">
                  <Activity size={18} className="text-danger" />
                  <span>Tanda Vital & Fisik</span>
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-6 col-lg-12">
                    <label className="form-label small fw-bold text-uppercase text-muted">Berat Badan (kg)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted"><Scale size={18} /></span>
                      <input
                        name="weight"
                        type="number"
                        step="0.1"
                        className="form-control border-start-0 ps-1"
                        placeholder="0.0"
                        value={formData.weight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-6 col-lg-12">
                    <label className="form-label small fw-bold text-uppercase text-muted">Suhu Tubuh (°F)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted"><Thermometer size={18} /></span>
                      <input
                        name="temperature"
                        type="number"
                        step="0.1"
                        className="form-control border-start-0 ps-1"
                        placeholder="0.0"
                        value={formData.temperature}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-6 col-lg-12">
                    <label className="form-label small fw-bold text-uppercase text-muted">Detak Jantung (HR)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted"><Heart size={18} /></span>
                      <input
                        name="heart_rate"
                        type="number"
                        className="form-control border-start-0 ps-1"
                        placeholder="bpm"
                        value={formData.heart_rate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-6 col-lg-12">
                    <label className="form-label small fw-bold text-uppercase text-muted">Respirasi (RR)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted"><Wind size={18} /></span>
                      <input
                        name="respiration_rate"
                        type="number"
                        className="form-control border-start-0 ps-1"
                        placeholder="rpm"
                        value={formData.respiration_rate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex gap-2 text-muted small">
                    <AlertCircle size={16} className="text-info flex-shrink-0 mt-1" />
                    <p className="mb-0">Pastikan pengukuran dilakukan dengan akurat sebelum menyimpan data vital.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: SOAP Notes */}
          <div className="col-lg-8 order-1 order-lg-2">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom px-4 py-3">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 text-dark">
                  <Clipboard size={18} className="text-primary" />
                  <span>Catatan Klinis (SOAP)</span>
                </h5>
              </div>
              <div className="card-body p-4">

                {/* Subjective */}
                <div className="mb-4">
                  <label className="form-label fw-bold d-flex align-items-center gap-2 text-primary">
                    <div className="bg-primary bg-opacity-10 p-1 rounded">S</div>
                    Subjective (Keluhan/Anamnesa)
                  </label>
                  <div className="input-group">
                    <textarea
                      name="subjective"
                      rows="3"
                      className="form-control bg-light border-0"
                      placeholder="Keluhan pemilik, riwayat penyakit, nafsu makan, dll..."
                      value={formData.subjective}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Objective */}
                <div className="mb-4">
                  <label className="form-label fw-bold d-flex align-items-center gap-2 text-info">
                    <div className="bg-info bg-opacity-10 p-1 rounded text-info">O</div>
                    Objective (Hasil Pemeriksaan Fisik)
                  </label>
                  <textarea
                    name="objective"
                    rows="3"
                    className="form-control bg-light border-0"
                    placeholder="Hasil inspeksi, palpasi, auskultasi, hasil lab..."
                    value={formData.objective}
                    onChange={handleChange}
                  />
                </div>

                {/* Assessment */}
                <div className="mb-4">
                  <label className="form-label fw-bold d-flex align-items-center gap-2 text-warning">
                    <div className="bg-warning bg-opacity-10 p-1 rounded text-warning">A</div>
                    Assessment (Diagnosa/Prognosa)
                  </label>
                  <textarea
                    name="assessment"
                    rows="2"
                    className="form-control bg-light border-0"
                    placeholder="Diagnosa tentatif atau definitif..."
                    value={formData.assessment}
                    onChange={handleChange}
                  />
                </div>

                {/* Plan */}
                <div className="mb-4">
                  <label className="form-label fw-bold d-flex align-items-center gap-2 text-success">
                    <div className="bg-success bg-opacity-10 p-1 rounded text-success">P</div>
                    Plan (Terapi/Tindakan/Resep)
                  </label>
                  <textarea
                    name="plan"
                    rows="3"
                    className="form-control bg-light border-0"
                    placeholder="Rencana pengobatan, resep obat, jadwal kontrol..."
                    value={formData.plan}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-grid pt-3 border-top">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg shadow-sm d-flex justify-content-center align-items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Menyimpan Rekam Medis...</span>
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>Simpan Rekam Medis</span>
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
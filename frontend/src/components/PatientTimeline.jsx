import React, { useEffect, useState } from 'react';
import { medicalRecordService } from '../api/medicalRecordService';
import { useAuth } from '../context/AuthContext';
import {
  Trash2,
  Activity,
  Thermometer,
  Heart,
  Wind,
  Weight,
  Stethoscope,
  FileText,
  ClipboardCheck,
  Syringe,
  Clock,
  Calendar
} from 'lucide-react';

const PatientTimeline = ({ patientId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const isAdmin = profile?.role === 'ADMINISTRATOR';

  useEffect(() => {
    if (patientId) {
      loadHistory();
    }
  }, [patientId]);

  const loadHistory = async () => {
    try {
      const response = await medicalRecordService.getPatientHistory(patientId);
      setRecords(response.data);
    } catch (error) {
      console.error("Error loading patient history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus rekam medis ini? Tindakan ini akan dicatat dan tidak dapat dibatalkan.")) {
      return;
    }

    try {
      await medicalRecordService.deleteRecord(recordId);
      setRecords(records.filter(r => r.id !== recordId));
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Gagal menghapus rekaman. Hanya Administrator yang dapat melakukan ini.");
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
      <span className="text-muted fw-medium">Memuat riwayat medis...</span>
    </div>
  );

  return (
    <div className="patient-timeline">
      {records.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border border-dashed shadow-sm">
          <div className="d-inline-flex bg-light rounded-circle p-4 mb-3 text-muted">
            <Activity size={32} />
          </div>
          <h5 className="fw-bold text-dark">Belum Ada Rekam Medis</h5>
          <p className="text-muted mb-0">Catatan SOAP dan riwayat vital akan muncul di sini.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-5">
          {records.map((record, index) => (
            <div key={record.id} className="timeline-item position-relative">

              {/* Connector Line (except for last item) */}
              {index !== records.length - 1 && (
                <div className="position-absolute start-0 top-0 h-100 border-start border-2 border-primary border-opacity-25 ms-3 d-none d-md-block" style={{ zIndex: 0, left: '6px' }}></div>
              )}

              <div className="row g-0">
                {/* Date Marker (Left Sidebar Desktop) */}
                <div className="col-md-2 d-none d-md-flex flex-column align-items-center pe-4 pt-1" style={{ zIndex: 1 }}>
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
                    <Calendar size={18} />
                  </div>
                  <div className="mt-2 text-center">
                    <div className="fw-bold text-dark lh-1">{new Date(record.created_at).toLocaleDateString('id-ID', { day: 'numeric' })}</div>
                    <div className="small text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem' }}>{new Date(record.created_at).toLocaleDateString('id-ID', { month: 'short' })}</div>
                    <div className="small text-muted mt-1">{new Date(record.created_at).getFullYear()}</div>
                  </div>
                </div>

                {/* Content Card */}
                <div className="col-md-10">
                  <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

                    {/* Header */}
                    <div className="card-header bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-md-none bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                          <Calendar size={16} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">Pemeriksaan Klinis</h6>
                          <div className="text-muted x-small d-flex align-items-center gap-2">
                            <Clock size={12} />
                            <span>{new Date(record.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="d-md-none">• {new Date(record.created_at).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-muted border fw-normal px-2">#{record.id}</span>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="btn btn-link text-danger p-0"
                            title="Hapus Rekaman"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Vitals Strip */}
                    <div className="bg-light px-4 py-3 border-bottom">
                      <div className="row g-2 text-center">
                        <div className="col-3 border-end">
                          <div className="text-muted x-small text-uppercase fw-bold mb-1">BB</div>
                          <div className="fw-bold text-dark">{record.weight ? `${record.weight} kg` : '-'}</div>
                        </div>
                        <div className="col-3 border-end">
                          <div className="text-muted x-small text-uppercase fw-bold mb-1">Suhu</div>
                          <div className="fw-bold text-danger">{record.temperature ? `${record.temperature}°F` : '-'}</div>
                        </div>
                        <div className="col-3 border-end">
                          <div className="text-muted x-small text-uppercase fw-bold mb-1">HR</div>
                          <div className="fw-bold text-primary">{record.heart_rate ? `${record.heart_rate}` : '-'}</div>
                        </div>
                        <div className="col-3">
                          <div className="text-muted x-small text-uppercase fw-bold mb-1">RR</div>
                          <div className="fw-bold text-info">{record.respiration_rate ? `${record.respiration_rate}` : '-'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="card-body p-4">
                      <div className="d-flex flex-column gap-4">
                        {/* Subjective */}
                        <div className="d-flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-primary bg-opacity-10 text-primary rounded p-2 d-flex align-items-center justify-content-center">
                              <Stethoscope size={18} />
                            </div>
                          </div>
                          <div>
                            <h6 className="fw-bold text-dark mb-1">Subjective</h6>
                            <p className="text-muted mb-0">{record.subjective || <em className="text-muted opacity-50">Tidak ada catatan</em>}</p>
                          </div>
                        </div>

                        {/* Objective */}
                        <div className="d-flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-info bg-opacity-10 text-info rounded p-2 d-flex align-items-center justify-content-center">
                              <Activity size={18} />
                            </div>
                          </div>
                          <div>
                            <h6 className="fw-bold text-dark mb-1">Objective</h6>
                            <p className="text-muted mb-0">{record.objective || <em className="text-muted opacity-50">Tidak ada catatan</em>}</p>
                          </div>
                        </div>

                        {/* Assessment */}
                        <div className="d-flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-warning bg-opacity-10 text-warning rounded p-2 d-flex align-items-center justify-content-center">
                              <ClipboardCheck size={18} />
                            </div>
                          </div>
                          <div>
                            <h6 className="fw-bold text-dark mb-1">Assessment</h6>
                            <p className="text-muted mb-0">{record.assessment || <em className="text-muted opacity-50">Tidak ada catatan</em>}</p>
                          </div>
                        </div>

                        {/* Plan */}
                        <div className="d-flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-success bg-opacity-10 text-success rounded p-2 d-flex align-items-center justify-content-center">
                              <Syringe size={18} />
                            </div>
                          </div>
                          <div>
                            <h6 className="fw-bold text-dark mb-1">Plan</h6>
                            <p className="text-muted mb-0">{record.plan || <em className="text-muted opacity-50">Tidak ada catatan</em>}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientTimeline;
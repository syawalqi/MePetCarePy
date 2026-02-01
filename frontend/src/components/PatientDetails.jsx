import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { patientService } from '../api/patientService';
import PatientTimeline from './PatientTimeline';
import InvoiceForm from './InvoiceForm';
import InvoiceList from './InvoiceList';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, Receipt, Calendar, Info, User, PawPrint } from 'lucide-react';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { profile } = useAuth();

  const canEdit = ['ADMINISTRATOR', 'VETERINARIAN'].includes(profile?.role);

  useEffect(() => {
    if (id) {
      loadPatient();
    }
  }, [id]);

  const loadPatient = async () => {
    try {
      const response = await patientService.getPatient(id);
      setPatient(response.data);
    } catch (error) {
      console.error("Error loading patient:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Memuat rekam medis...</p>
    </div>
  );

  if (!patient) return (
    <div className="text-center py-5">
      <div className="alert alert-danger d-inline-block">Data pasien tidak ditemukan.</div>
    </div>
  );

  return (
    <div className="container-fluid pb-5">
      {/* Back Button */}
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-link text-muted d-flex align-items-center gap-2 p-0 text-decoration-none">
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </button>
      </div>

      <div className="row g-4">
        {/* Main Content: Timeline */}
        <div className="col-lg-8 order-2 order-lg-1">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Riwayat Medis</h2>
              <p className="text-muted small mb-0">Linimasa kesehatan {patient.name}</p>
            </div>
            {canEdit && (
              <Link to={`/patients/${id}/records/new`} className="btn btn-success shadow-sm d-flex align-items-center gap-2">
                <Plus size={18} />
                <span className="d-none d-sm-inline">Catat SOAP</span>
              </Link>
            )}
          </div>

          <PatientTimeline patientId={id} />
        </div>

        {/* Sidebar: Patient Info & Actions */}
        <div className="col-lg-4 order-1 order-lg-2">

          {/* Patient Info Card */}
          <div className="card shadow-sm border-0 mb-4 overflow-hidden">
            <div className="bg-gradient-primary-to-r p-4 text-white position-relative overflow-hidden">
              {/* Decorative background icon */}
              <PawPrint size={120} className="position-absolute end-0 top-0 opacity-10 me-n3 mt-n3" />

              <h4 className="fw-bold mb-1">{patient.name}</h4>
              <span className="badge bg-white bg-opacity-25 border border-white border-opacity-25 rounded-pill px-3">
                Pasien #{patient.id}
              </span>
            </div>

            <div className="card-body p-4">
              <div className="mb-4">
                <label className="text-uppercase text-muted fw-bold x-small mb-1" style={{ fontSize: '0.7rem' }}>Spesies / Ras</label>
                <div className="fw-medium text-dark">{patient.species} • {patient.breed || '-'}</div>
              </div>

              <div className="mb-4">
                <label className="text-uppercase text-muted fw-bold x-small mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                  <Calendar size={12} />
                  <span>Tanggal Lahir</span>
                </label>
                <div className="fw-medium text-dark">{patient.date_of_birth || 'Tidak tercatat'}</div>
              </div>

              <div className="pt-3 border-top">
                <Link to={`/owners/${patient.owner_id}`} className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2">
                  <User size={16} />
                  <span>Lihat Profil Pemilik</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Billing Actions */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-bottom-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 text-dark">
                <Receipt size={20} className="text-success" />
                <span>Tagihan</span>
              </h5>
              <button
                onClick={() => setShowInvoiceForm(!showInvoiceForm)}
                className={`btn btn-sm rounded-pill px-3 ${showInvoiceForm ? 'btn-light border' : 'btn-success text-white shadow-sm'}`}
              >
                {showInvoiceForm ? "Batal" : "Buat Tagihan"}
              </button>
            </div>

            <div className="card-body p-4">
              {showInvoiceForm && (
                <div className="mb-4 p-3 bg-light rounded border">
                  <InvoiceForm
                    patientId={id}
                    onSuccess={() => {
                      setShowInvoiceForm(false);
                      setRefreshKey(old => old + 1);
                    }}
                  />
                </div>
              )}

              <InvoiceList key={refreshKey} patientId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
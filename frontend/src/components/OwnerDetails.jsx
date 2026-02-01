import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ownerService } from '../api/ownerService';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  PawPrint,
  Plus,
  ChevronRight,
  ArrowLeft,
  Dog,
  Cat
} from 'lucide-react';

const OwnerDetails = () => {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const isManagement = ['ADMINISTRATOR', 'SUPPORT_STAFF'].includes(profile?.role);
  const canViewRecords = ['ADMINISTRATOR', 'VETERINARIAN'].includes(profile?.role);

  useEffect(() => {
    loadOwner();
  }, [id]);

  const loadOwner = async () => {
    try {
      const response = await ownerService.getOwner(id);
      setOwner(response.data);
    } catch (error) {
      console.error('Error loading owner:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSpeciesIcon = (species) => {
    const s = species?.toLowerCase() || '';
    if (s.includes('dog') || s.includes('anjing')) return <Dog size={18} className="text-primary" />;
    if (s.includes('cat') || s.includes('kucing')) return <Cat size={18} className="text-info" />;
    return <PawPrint size={18} className="text-muted" />;
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Memuat profil pemilik...</p>
    </div>
  );

  if (!owner) return (
    <div className="text-center py-5">
      <div className="alert alert-warning d-inline-block">Data pemilik tidak ditemukan.</div>
    </div>
  );

  return (
    <div className="container-fluid pb-5">
      {/* Header / Breadcrumb */}
      <div className="mb-4">
        <Link to="/owners" className="text-decoration-none text-muted mb-2 d-inline-flex align-items-center gap-1 small">
          <ArrowLeft size={16} />
          <span>Kembali ke Direktori</span>
        </Link>
        <h2 className="fw-bold mb-0">Profil Pemilik</h2>
      </div>

      <div className="row g-4">
        {/* Left Column: Owner Info */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4 text-center">
              <div className="mb-3 d-inline-block p-3 rounded-circle bg-primary bg-opacity-10">
                <User size={48} className="text-primary" />
              </div>
              <h4 className="fw-bold mb-1">{owner.full_name}</h4>
              <p className="text-muted small mb-4">ID: #{owner.id}</p>

              <div className="text-start">
                <hr className="my-4" />
                <h6 className="fw-bold mb-3 text-uppercase text-muted small">Informasi Kontak</h6>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-light p-2 rounded text-muted"> <Phone size={18} /> </div>
                  <div>
                    <small className="d-block text-muted">Telepon</small>
                    <span className="fw-medium">{owner.phone_number}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-light p-2 rounded text-muted"> <Mail size={18} /> </div>
                  <div>
                    <small className="d-block text-muted">Email</small>
                    <span className="fw-medium">{owner.email || '-'}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2 rounded text-muted"> <MapPin size={18} /> </div>
                  <div>
                    <small className="d-block text-muted">Alamat</small>
                    <span className="fw-medium text-break">{owner.address || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pets List */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Hewan Peliharaan Terdaftar</h5>
              {isManagement && (
                <Link to={`/patients/new?owner_id=${owner.id}`} className="btn btn-sm btn-primary d-flex align-items-center gap-2">
                  <Plus size={16} />
                  <span className="d-none d-sm-inline">Tambah Hewan</span>
                </Link>
              )}
            </div>

            <div className="card-body p-0">
              {owner.patients && owner.patients.length > 0 ? (
                <div className="list-group list-group-flush">
                  {owner.patients.map(patient => (
                    <div key={patient.id} className="list-group-item p-4 border-light-subtle hover-bg-light transition-all">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-4">
                          <div className="bg-light p-3 rounded-circle">
                            {getSpeciesIcon(patient.species)}
                          </div>
                          <div>
                            <h5 className="fw-bold mb-1">{patient.name}</h5>
                            <div className="d-flex gap-2 text-muted small">
                              <span className="badge bg-light text-dark border">{patient.species}</span>
                              <span>•</span>
                              <span>{patient.breed || 'Ras tidak diketahui'}</span>
                            </div>
                          </div>
                        </div>

                        {canViewRecords ? (
                          <Link
                            to={`/patients/${patient.id}`}
                            className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-2"
                          >
                            <span>Rekam Medis</span>
                            <ChevronRight size={16} />
                          </Link>
                        ) : (
                          <span className="text-muted small fst-italic">Akses terbatas</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="mb-3 text-muted opacity-50">
                    <PawPrint size={48} />
                  </div>
                  <p className="text-muted">Belum ada hewan peliharaan yang didaftarkan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDetails;
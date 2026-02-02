import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Cat,
  Trash2,
  Edit3,
  ExternalLink,
  Calendar
} from 'lucide-react';

const OwnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const isManagement = ['SUPERADMIN', 'ADMINISTRATOR', 'SUPPORT_STAFF'].includes(profile?.role);
  const canDelete = ['SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN'].includes(profile?.role);
  const canViewRecords = ['SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN'].includes(profile?.role);

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

  const handleDelete = async () => {
    if (!window.confirm("Hapus pemilik ini? Semua data terkait akan disembunyikan. Tindakan ini tidak dapat dibatalkan dengan mudah.")) return;
    try {
      await ownerService.deleteOwner(id);
      navigate('/owners');
    } catch (error) {
      alert("Gagal menghapus pemilik.");
    }
  };

  const getSpeciesIcon = (species) => {
    const s = species?.toLowerCase() || '';
    if (s.includes('dog') || s.includes('anjing')) return <Dog size={24} className="text-primary" />;
    if (s.includes('cat') || s.includes('kucing')) return <Cat size={24} className="text-info" />;
    return <PawPrint size={24} className="text-muted" />;
  };

  if (loading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3 text-muted">Memuat data pemilik...</p>
    </div>
  );

  if (!owner) return (
    <div className="container py-5 text-center">
      <div className="alert alert-warning d-inline-block shadow-sm">Data pemilik tidak ditemukan.</div>
      <div className="mt-3">
        <Link to="/owners" className="btn btn-primary">Kembali ke Daftar</Link>
      </div>
    </div>
  );

  return (
    <div className="container-fluid pb-5">
      {/* Breadcrumb & Quick Actions */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item"><Link to="/owners" className="text-decoration-none text-primary">Direktori Pemilik</Link></li>
              <li className="breadcrumb-item active" aria-current="page">#{owner.id}</li>
            </ol>
          </nav>
          <h2 className="fw-bold mb-0 text-dark">Informasi Pemilik</h2>
        </div>
        <div className="d-flex gap-2 w-100 w-md-auto">
          {canDelete && (
            <button onClick={handleDelete} className="btn btn-outline-danger d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0 justify-content-center shadow-sm">
              <Trash2 size={18} />
              <span>Hapus</span>
            </button>
          )}
          {isManagement && (
            <Link to={`/owners/edit/${owner.id}`} className="btn btn-outline-secondary d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0 justify-content-center shadow-sm">
              <Edit3 size={18} />
              <span>Edit Profil</span>
            </Link>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-12">
          <div className="card shadow-sm border-0 overflow-hidden mb-4">
            <div className="bg-primary bg-gradient p-4" style={{ height: '100px' }}></div>
            <div className="card-body px-4 pt-0 position-relative">
              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-4" style={{ marginTop: '-50px' }}>
                <div className="bg-white p-1 rounded-circle shadow-sm">
                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border" style={{ width: '120px', height: '120px' }}>
                    <User size={64} className="text-primary opacity-75" />
                  </div>
                </div>
                <div className="mb-md-3 text-center text-md-start flex-grow-1">
                  <h3 className="fw-bold mb-1 text-dark">{owner.full_name}</h3>
                  <p className="text-muted mb-0 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10">Client ID: MP-{owner.id}</span>
                    <span className="text-opacity-50">•</span>
                    <span className="small d-flex align-items-center gap-1">
                      <Calendar size={14} /> Terdaftar sejak {new Date(owner.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </span>
                  </p>
                </div>
              </div>

              <hr className="my-4" />

              <div className="row g-4 pb-2">
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-3 rounded-3 text-primary"> <Phone size={24} /> </div>
                    <div>
                      <small className="d-block text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.05rem' }}>No. Telepon</small>
                      <span className="h6 fw-bold mb-0">{owner.phone_number}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-3 rounded-3 text-info"> <Mail size={24} /> </div>
                    <div>
                      <small className="d-block text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.05rem' }}>Email</small>
                      <span className="h6 fw-bold mb-0 text-break">{owner.email || '-'}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-3 rounded-3 text-success"> <MapPin size={24} /> </div>
                    <div className="flex-grow-1">
                      <small className="d-block text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.05rem' }}>Alamat</small>
                      <span className="h6 fw-bold mb-0 d-block">{owner.address || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pets Section */}
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <PawPrint size={24} className="text-primary" />
              <span>Hewan Peliharaan</span>
              <span className="badge rounded-pill bg-light text-primary border ms-2">{owner.patients?.length || 0}</span>
            </h4>
            {isManagement && (
              <Link to={`/patients/new?owner_id=${owner.id}`} className="btn btn-primary d-flex align-items-center gap-2 shadow-sm rounded-pill px-4">
                <Plus size={18} />
                <span>Daftarkan Hewan</span>
              </Link>
            )}
          </div>

          <div className="row g-3">
            {owner.patients && owner.patients.length > 0 ? (
              owner.patients.map(patient => (
                <div key={patient.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0 hover-shadow transition-all border-start border-primary border-4">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="bg-light p-3 rounded-circle border">
                          {getSpeciesIcon(patient.species)}
                        </div>
                        {canViewRecords && (
                          <Link to={`/patients/${patient.id}`} className="btn btn-light rounded-circle p-2 text-primary shadow-sm hover-bg-primary hover-text-white transition-all">
                            <ExternalLink size={18} />
                          </Link>
                        )}
                      </div>
                      <h5 className="fw-bold mb-1 text-dark">{patient.name}</h5>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <span className="badge bg-light text-secondary border px-2 py-1">{patient.species}</span>
                        <span className="badge bg-light text-secondary border px-2 py-1">{patient.breed || 'Ras Campuran'}</span>
                      </div>
                      <div className="pt-3 border-top d-flex justify-content-between align-items-center mt-auto">
                        <div className="small text-muted">Gender: <span className="text-dark fw-medium">{patient.gender || 'Tidak Ada'}</span></div>
                        {canViewRecords ? (
                          <Link to={`/patients/${patient.id}`} className="text-primary fw-bold text-decoration-none small d-flex align-items-center gap-1">
                            Buka Rekam Medis <ChevronRight size={14} />
                          </Link>
                        ) : (
                          <span className="small text-muted fst-italic">Hanya Baca</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-dashed p-5">
                  <div className="bg-light rounded-circle d-inline-flex p-4 mb-3 text-muted opacity-50">
                    <PawPrint size={48} />
                  </div>
                  <h5 className="text-dark fw-bold">Belum ada hewan peliharaan</h5>
                  <p className="text-muted mx-auto" style={{ maxWidth: '300px' }}>Daftarkan hewan peliharaan pertama untuk pemilik ini menggunakan tombol di atas.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDetails;
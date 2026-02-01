import React, { useState } from 'react';
import { userService } from '../api/userService';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Shield, Key, ArrowLeft } from 'lucide-react';

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
      setError(error.response?.data?.detail || "Gagal membuat akun staf.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">

          <button onClick={() => navigate('/staff')} className="btn btn-link text-muted d-flex align-items-center gap-2 p-0 mb-4 text-decoration-none">
            <ArrowLeft size={16} />
            <span>Kembali ke Daftar Staf</span>
          </button>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom py-4 text-center">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3 mb-3">
                <UserPlus size={32} />
              </div>
              <h4 className="fw-bold mb-1">Tambah Staf Baru</h4>
              <p className="text-muted small mb-0">Buat akun untuk staf klinik baru</p>
            </div>

            <div className="card-body p-4">
              {error && <div className="alert alert-danger mb-4">{error}</div>}

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase text-muted">Nama Lengkap</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><User size={18} /></span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-1"
                      name="full_name"
                      placeholder="Nama lengkap staf..."
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase text-muted">Alamat Email</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><Mail size={18} /></span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-1"
                      name="email"
                      placeholder="nama@klinik.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase text-muted">Peran (Role)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><Shield size={18} /></span>
                    <select
                      name="role"
                      className="form-select border-start-0 ps-1"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="SUPPORT_STAFF">Staf Pendukung (Resepsionis/Admin)</option>
                      <option value="VETERINARIAN">Dokter Hewan</option>
                      <option value="ADMINISTRATOR">Administrator Sistem</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-uppercase text-muted">Kata Sandi Sementara</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><Key size={18} /></span>
                    <input
                      type="password"
                      className="form-control border-start-0 ps-1"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      placeholder="Minimal 6 karakter..."
                    />
                  </div>
                  <div className="form-text small mt-2">
                    Staf disarankan untuk mengganti password ini setelah login pertama kali.
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" disabled={loading} className="btn btn-primary py-2 fw-bold shadow-sm">
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Memproses...
                      </>
                    ) : 'Buat Akun Staf'}
                  </button>
                  <button type="button" onClick={() => navigate('/staff')} className="btn btn-light text-muted py-2">
                    Batal
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffForm;

import React, { useEffect, useState } from 'react';
import { userService } from '../../api/userService';
import { Link } from 'react-router-dom';
import LoadingScreen from '../common/LoadingScreen';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  UserPlus,
  Search,
  LayoutGrid,
  List as ListIcon,
  Shield,
  Mail,
  CheckCircle2,
  Crown,
  Trash2
} from 'lucide-react';

const StaffList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const { profile } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error loading staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("PERINGATAN: Menghapus staf akan menghapus akun login dan profil mereka secara permanen. Lanjutkan?")) return;
    try {
      await userService.deleteUser(userId);
      loadUsers();
    } catch (error) {
      alert(error.response?.data?.detail || "Gagal menghapus staf.");
    }
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SUPERADMIN':
        return <span className="badge bg-dark text-white border border-dark d-flex align-items-center gap-1">
          <Crown size={12} /> Super Admin
        </span>;
      case 'ADMINISTRATOR':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">Administrator</span>;
      case 'VETERINARIAN':
        return <span className="badge bg-success-subtle text-success border border-success-subtle">Dokter Hewan</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Staf Pendukung</span>;
    }
  };

  const isSuperAdmin = profile?.role === 'SUPERADMIN';

  if (loading) return <LoadingScreen message="Memuat data staf..." />;

  return (
    <div className="container-fluid pb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manajemen Staf</h2>
          <p className="text-muted mb-0">Kelola akun dan akses pengguna klinik.</p>
        </div>
        {isSuperAdmin && (
          <Link to="/staff/new" className="btn btn-primary d-flex align-items-center gap-2 shadow-sm">
            <UserPlus size={18} />
            <span className="d-none d-md-inline">Tambah Staf</span>
          </Link>
        )}
      </div>

      {/* Controls */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Cari nama, email, atau role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
          <div className="btn-group shadow-sm">
            <button
              className={`btn ${viewMode === 'card' ? 'btn-primary' : 'btn-outline-secondary bg-white'}`}
              onClick={() => setViewMode('card')}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary bg-white'}`}
              onClick={() => setViewMode('table')}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-5 bg-light rounded border border-dashed">
          <p className="text-muted mb-0">Tidak ada data staf yang ditemukan.</p>
        </div>
      ) : (
        <>
          {viewMode === 'card' ? (
            <div className="row g-3">
              {filteredUsers.map((u) => (
                <div key={u.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm border-0 hover-shadow transition-all">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-3">
                          <Users size={24} />
                        </div>
                        <div className="d-flex flex-column align-items-end gap-2">
                          {getRoleBadge(u.role)}
                          {isSuperAdmin && u.id !== profile?.id && (
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="btn btn-link text-danger p-0"
                              title="Hapus Staf"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>

                      <h5 className="card-title fw-bold mb-1">{u.full_name}</h5>
                      <div className="d-flex align-items-center gap-2 text-muted small mb-3">
                        <Mail size={14} />
                        <span className="text-truncate">{u.email}</span>
                      </div>

                      <div className="pt-3 border-top mt-3 d-flex justify-content-between align-items-center">
                        <span className="badge bg-success-subtle text-success d-flex align-items-center gap-1 rounded-pill px-2">
                          <CheckCircle2 size={12} /> Aktif
                        </span>
                        <small className="text-muted">ID: #{u.id.substring(0, 8)}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card shadow-sm border-0 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3 ps-4">Nama Lengkap</th>
                      <th className="py-3">Peran (Role)</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 pe-4 text-end">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="ps-4 fw-medium text-dark">{u.full_name}</td>
                        <td>{getRoleBadge(u.role)}</td>
                        <td className="text-muted">{u.email}</td>
                        <td>
                          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                            Aktif
                          </span>
                        </td>
                        <td className="pe-4 text-end">
                          {isSuperAdmin && u.id !== profile?.id ? (
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="btn btn-outline-danger btn-sm rounded-circle border-0"
                              title="Hapus Staf"
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <small className="text-muted">N/A</small>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StaffList;
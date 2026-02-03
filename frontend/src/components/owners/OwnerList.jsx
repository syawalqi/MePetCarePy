import React, { useEffect, useState } from 'react';
import { ownerService } from '../../api/ownerService';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../common/LoadingScreen';
import {
  Plus,
  User,
  Phone,
  Mail,
  ChevronRight,
  Search,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ArrowDownNarrowWide
} from 'lucide-react';

const OwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const itemsPerPage = 10;

  const { profile } = useAuth();
  const isManagement = ['SUPERADMIN', 'ADMINISTRATOR', 'SUPPORT_STAFF'].includes(profile?.role);

  // Responsive view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setViewMode('table');
      } else {
        setViewMode('card');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load owners when page changes (parallel, non-blocking)
  useEffect(() => {
    loadOwners();
  }, [currentPage]);

  const loadOwners = async () => {
    try {
      setLoading(true);
      const response = await ownerService.getOwners({
        page: currentPage,
        limit: itemsPerPage
      });
      setOwners(response.data.items);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
    } catch (error) {
      console.error('Error loading owners:', error);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering for search (server-side search can be added later)
  const filteredOwners = owners.filter(owner =>
    owner.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.phone_number.includes(searchTerm)
  );

  // Display current page items from server
  const currentItems = filteredOwners;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <LoadingScreen message="Membuka direktori pemilik..." />;

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Direktori Pemilik</h2>
          <p className="text-muted mb-0 small">Kelola data klien dan informasi kontak</p>
        </div>
        {isManagement && (
          <Link to="/owners/new" className="btn btn-primary d-flex align-items-center justify-content-center gap-2 px-4 shadow-sm">
            <Plus size={18} />
            <span>Tambah Pemilik</span>
          </Link>
        )}
      </div>

      {/* Controls: Search & View Toggle */}
      <div className="card shadow-sm border-0 mb-4 bg-white">
        <div className="card-body p-3">
          <div className="d-flex flex-column flex-md-row gap-3">
            <div className="input-group flex-grow-1">
              <span className="input-group-text bg-light border-0">
                <Search size={18} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none bg-light"
                placeholder="Cari nama atau no. telepon..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on search
                }}
              />
            </div>

            {/* Sort Order */}
            <div className="d-flex align-items-center gap-2">
              <div className="input-group input-group-sm border-0 bg-light rounded" style={{ width: 'auto' }}>
                <span className="input-group-text bg-transparent border-0 pe-0">
                  <ArrowDownNarrowWide size={16} className="text-muted" />
                </span>
                <select
                  className="form-select border-0 bg-transparent shadow-none small"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="d-flex bg-light rounded p-1 align-self-end align-self-md-auto">
              <button
                onClick={() => setViewMode('card')}
                className={`btn btn-sm d-flex align-items-center gap-2 border-0 ${viewMode === 'card' ? 'bg-white shadow-sm fw-bold' : 'text-muted'}`}
              >
                <LayoutGrid size={16} />
                <span className="d-none d-md-inline">Kartu</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`btn btn-sm d-flex align-items-center gap-2 border-0 ${viewMode === 'table' ? 'bg-white shadow-sm fw-bold' : 'text-muted'}`}
              >
                <TableIcon size={16} />
                <span className="d-none d-md-inline">Tabel</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {filteredOwners.length === 0 ? (
        <div className="text-center py-5 text-muted bg-white rounded shadow-sm">
          <p className="mb-0">Tidak ditemukan pemilik yang cocok.</p>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            /* Table View */
            <div className="card shadow-sm border-0 mb-4">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light text-muted small text-uppercase">
                    <tr>
                      <th className="px-4 py-3">Nama Pemilik</th>
                      <th className="py-3">Kontak</th>
                      <th className="py-3 text-end px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((owner) => (
                      <tr key={owner.id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2 text-primary">
                              <User size={20} />
                            </div>
                            <div className="fw-bold">{owner.full_name}</div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="d-flex flex-column gap-1 small text-muted">
                            <div className="d-flex align-items-center gap-2">
                              <Phone size={14} />
                              <span>{owner.phone_number}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <Mail size={14} />
                              <span>{owner.email || '-'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="text-end px-4 py-3">
                          <Link
                            to={`/owners/${owner.id}`}
                            className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                          >
                            <span>Profil</span>
                            <ChevronRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Card View */
            <div className="row g-3 mb-4">
              {currentItems.map((owner) => (
                <div className="col-md-6 col-lg-4" key={owner.id}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-3 text-primary">
                          <User size={24} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{owner.full_name}</h6>
                          <small className="text-muted">ID: #{owner.id}</small>
                        </div>
                      </div>

                      <div className="mb-3 ps-1">
                        <div className="d-flex align-items-center gap-2 mb-2 text-muted small">
                          <Phone size={16} className="text-primary opacity-75" />
                          <span>{owner.phone_number}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <Mail size={16} className="text-secondary opacity-75" />
                          <span>{owner.email || 'Tidak ada email'}</span>
                        </div>
                      </div>

                      <Link
                        to={`/owners/${owner.id}`}
                        className="btn btn-outline-primary w-100 btn-sm d-flex justify-content-between align-items-center"
                      >
                        <span>Lihat Profil</span>
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-2 mb-5">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>

              <span className="small text-muted">
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OwnerList;

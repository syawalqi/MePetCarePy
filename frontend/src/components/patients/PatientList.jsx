import React, { useEffect, useState } from 'react';
import { patientService } from '../../api/patientService';
import { Link } from 'react-router-dom';
import LoadingScreen from '../common/LoadingScreen';
import {
  PawPrint,
  Dog,
  Cat,
  Search,
  ChevronRight,
  LayoutGrid,
  Table as TableIcon,
  ChevronLeft,
  ArrowDownNarrowWide
} from 'lucide-react';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const itemsPerPage = 10;

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

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await patientService.getPatients();
      setPatients(response.data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedPatients = [...patients].sort((a, b) => {
    if (sortOrder === 'newest') return b.id - a.id;
    return a.id - b.id;
  });

  const filteredPatients = sortedPatients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getSpeciesIcon = (species) => {
    const s = species.toLowerCase();
    if (s.includes('dog') || s.includes('anjing')) return <Dog size={20} className="text-primary" />;
    if (s.includes('cat') || s.includes('kucing')) return <Cat size={20} className="text-info" />;
    return <PawPrint size={20} className="text-muted" />;
  };

  if (loading) return <LoadingScreen message="Menyiapkan data pasien..." />;

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Patients</h2>
      </div>

      {/* Controls */}
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
                placeholder="Cari nama atau spesies..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
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

      {/* Content */}
      {filteredPatients.length === 0 ? (
        <div className="col-12 text-center py-5 text-muted bg-white rounded shadow-sm">
          Tidak ada pasien ditemukan.
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
                      <th className="px-4 py-3">Pasien</th>
                      <th className="py-3">Detail</th>
                      <th className="py-3 text-end px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="bg-light rounded-circle p-2">
                              {getSpeciesIcon(patient.species)}
                            </div>
                            <div>
                              <div className="fw-bold">{patient.name}</div>
                              <span className="badge bg-light text-dark border">{patient.species}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="d-flex flex-column gap-1 small text-muted">
                            <div><strong>Ras:</strong> {patient.breed || '-'}</div>
                            <div><strong>Lahir:</strong> {patient.date_of_birth || '-'}</div>
                          </div>
                        </td>
                        <td className="text-end px-4 py-3">
                          <Link
                            to={`/patients/${patient.id}`}
                            className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                          >
                            <span>Rekam Medis</span>
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
              {currentItems.map((patient) => (
                <div className="col-md-6 col-lg-4" key={patient.id}>
                  <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-light rounded-p-2 p-2">
                            {getSpeciesIcon(patient.species)}
                          </div>
                          <div>
                            <h5 className="fw-bold mb-0">{patient.name}</h5>
                            <span className="badge bg-light text-dark small border">{patient.species}</span>
                          </div>
                        </div>
                        <Link to={`/patients/${patient.id}`} className="text-muted">
                          <ChevronRight size={20} />
                        </Link>
                      </div>

                      <div className="small text-muted mb-3 border-top pt-2 mt-2">
                        <div className="mb-1 d-flex justify-content-between"><span>Ras:</span> <strong>{patient.breed || '-'}</strong></div>
                        <div className="d-flex justify-content-between"><span>Lahir:</span> <strong>{patient.date_of_birth || '-'}</strong></div>
                      </div>

                      <Link
                        to={`/patients/${patient.id}`}
                        className="btn btn-sm btn-outline-primary w-100 mt-2"
                      >
                        Buka Rekam Medis
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
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

export default PatientList;
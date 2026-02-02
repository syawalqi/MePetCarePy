import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  PawPrint,
  PlusCircle,
  ClipboardList,
  BadgeDollarSign,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardHome = () => {
  const { profile } = useAuth();

  const actions = [
    { title: 'Pemilik Baru', path: '/owners/new', icon: <Users className="text-primary" />, roles: ['SUPERADMIN', 'ADMINISTRATOR', 'SUPPORT_STAFF'] },
    { title: 'Pasien Baru', path: '/patients/new', icon: <PawPrint className="text-success" />, roles: ['SUPERADMIN', 'ADMINISTRATOR', 'SUPPORT_STAFF'] },
    { title: 'Kelola Staf', path: '/staff', icon: <ClipboardList className="text-info" />, roles: ['SUPERADMIN', 'ADMINISTRATOR'] },
    { title: 'Laporan Keuangan', path: '/reports', icon: <BadgeDollarSign className="text-warning" />, roles: ['SUPERADMIN', 'ADMINISTRATOR'] },
  ];

  const filteredActions = actions.filter(action => action.roles.includes(profile?.role));

  return (
    <div className="container py-2 pb-5">
      <div className="mb-4 mb-md-5">
        <h1 className="display-6 fw-bold text-dark">Selamat Datang, {profile?.full_name.split(' ')[0]}!</h1>
        <p className="text-secondary">Apa yang ingin Anda lakukan hari ini?</p>
      </div>

      {/* Action Cards */}
      <div className="row g-3 g-md-4 mb-5">
        {filteredActions.map((action) => (
          <div className="col-6 col-sm-6 col-md-6 col-lg-3" key={action.path}>
            <Link to={action.path} className="text-decoration-none text-dark">
              <div className="card h-100 p-3 p-md-4 text-center border-0 shadow-sm hover-lift transition-all bg-white">
                <div className="mb-3 d-flex justify-content-center">
                  <div className="p-3 rounded-circle bg-light bg-opacity-50 text-wrap">
                    {React.cloneElement(action.icon, { size: 28 })}
                  </div>
                </div>
                <h6 className="fw-bold mb-0 small text-wrap">{action.title}</h6>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Quick Links */}
        <div className="col-md-8">
          <div className="card p-4 bg-white shadow-sm border-0 h-100">
            <h5 className="fw-bold mb-4 text-dark">Akses Cepat</h5>
            <div className="list-group list-group-flush gap-2">
              <Link to="/owners" className="list-group-item list-group-item-action py-3 border-0 rounded bg-gray-50 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-primary bg-opacity-10 p-2 rounded text-primary">
                    <Users size={20} />
                  </div>
                  <span className="fw-medium">Lihat Data Pemilik</span>
                </div>
                <ChevronRight size={18} className="text-muted" />
              </Link>
              <Link to="/patients" className="list-group-item list-group-item-action py-3 border-0 rounded bg-gray-50 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-success bg-opacity-10 p-2 rounded text-success">
                    <PawPrint size={20} />
                  </div>
                  <span className="fw-medium">Lihat Data Pasien</span>
                </div>
                <ChevronRight size={18} className="text-muted" />
              </Link>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="col-md-4">
          <div className="card p-4 bg-primary text-white shadow-md border-0 h-100 position-relative overflow-hidden">
            {/* Decorator */}
            <div className="position-absolute top-0 end-0 opacity-10 p-3">
              <ClipboardList size={80} />
            </div>

            <h5 className="fw-bold mb-3 position-relative">Status Klinik</h5>
            <div className="mb-4 position-relative">
              <small className="d-block opacity-75 text-uppercase" style={{ fontSize: '0.7rem' }}>Peran Saat Ini</small>
              <span className="h4 fw-bold">{profile?.role}</span>
            </div>
            <div className="mt-auto position-relative">
              <p className="small mb-0 opacity-75">Sistem Manajemen Internal MePetCarePy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

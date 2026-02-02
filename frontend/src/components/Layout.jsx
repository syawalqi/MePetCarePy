import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Users,
  PawPrint,
  UserCog,
  BarChart3,
  LogOut,
  PlusCircle,
  Menu,
  UserCircle
} from 'lucide-react';
import OfflineBanner from './OfflineBanner';

const Layout = () => {
  const { profile, logout, deferredPrompt, handleInstallClick } = useAuth();
  const location = useLocation();
  const [showMobileProfile, setShowMobileProfile] = useState(false);

  // Helper check for iOS PWA prompt
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // Localized Menu Items (Bahasa Indonesia)
  const menuItems = [
    { name: 'Beranda', path: '/', icon: <Home size={24} />, roles: ['ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF'] },
    { name: 'Pemilik', path: '/owners', icon: <Users size={24} />, roles: ['ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF'] },
    { name: 'Pasien', path: '/patients', icon: <PawPrint size={24} />, roles: ['ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF'] },
    { name: 'Staf', path: '/staff', icon: <UserCog size={24} />, roles: ['ADMINISTRATOR'] },
    { name: 'Keuangan', path: '/reports', icon: <BarChart3 size={24} />, roles: ['ADMINISTRATOR'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(profile?.role));

  if (!profile) return <Outlet />;

  // Components
  const SidebarContent = () => (
    <div className="position-sticky pt-4 h-100 d-flex flex-column bg-white shadow-sm border-end">
      <div className="px-4 mb-4">
        <h4 className="text-primary fw-bold mb-0">MePetCare</h4>
        <small className="text-muted fw-medium">{profile.role}</small>
      </div>

      <ul className="nav flex-column px-3 gap-1">
        {filteredMenu.map((item) => (
          <li className="nav-item" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center gap-3 py-3 px-3 rounded ${location.pathname === item.path ? 'active shadow-sm' : ''
                }`}
            >
              {React.cloneElement(item.icon, { size: 20 })}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="px-3 mt-auto mb-4">
        <div className="p-3 bg-light rounded mb-3 border">
          <div className="fw-bold text-truncate text-dark">{profile.full_name}</div>
          <div className="text-muted text-truncate small">{profile.email}</div>
        </div>
        <button
          onClick={logout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  const BottomNav = () => (
    <nav className="bottom-nav d-md-none d-flex justify-content-around align-items-center px-2 shadow-lg border-top">
      {filteredMenu.slice(0, 5).map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`bottom-nav-item d-flex flex-column align-items-center text-decoration-none ${location.pathname === item.path ? 'active' : ''
            }`}
          style={{ width: '20%' }}
        >
          {React.cloneElement(item.icon, { size: 24, strokeWidth: location.pathname === item.path ? 2.5 : 2 })}
          <span className="mt-1 text-truncate w-100 text-center" style={{ fontSize: '0.65rem' }}>{item.name}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">

        {/* Desktop Sidebar */}
        <nav className="col-md-3 col-lg-2 d-none d-md-block sidebar p-0">
          <SidebarContent />
        </nav>

        {/* Main Content Area */}
        <main className="col-md-9 ms-sm-auto col-lg-10 app-main d-flex flex-column min-vh-100 position-relative">
          <OfflineBanner />

          {/* Mobile Header (Restored) */}
          <header className="d-md-none bg-white p-3 shadow-sm border-bottom sticky-top d-flex justify-content-between align-items-center z-3">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary rounded p-1">
                <PawPrint size={18} className="text-white" />
              </div>
              <h5 className="fw-bold text-primary mb-0">MePetCare</h5>
            </div>

            <button
              className="btn btn-light rounded-circle p-2 text-primary position-relative"
              onClick={() => setShowMobileProfile(!showMobileProfile)}
            >
              <UserCircle size={24} />
            </button>

            {/* Mobile Profile Dropdown */}
            {showMobileProfile && (
              <div className="position-absolute end-0 top-100 mt-2 me-2 bg-white shadow-lg rounded p-3 border" style={{ width: '260px', zIndex: 1050 }}>
                <div className="mb-3 border-bottom pb-2">
                  <div className="fw-bold text-dark">{profile.full_name}</div>
                  <small className="text-muted d-block">{profile.role}</small>
                </div>

                {deferredPrompt && (
                  <button
                    onClick={() => { handleInstallClick(); setShowMobileProfile(false); }}
                    className="btn btn-success btn-sm w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                  >
                    <PlusCircle size={16} />
                    <span>Instal Aplikasi</span>
                  </button>
                )}

                <button
                  onClick={() => { logout(); setShowMobileProfile(false); }}
                  className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </header>

          {/* iOS Instructions */}
          {isIOS && !deferredPrompt && (
            <div className="d-md-none px-3 pt-3">
              <div className="alert alert-info py-2 small mb-0 text-center shadow-sm border-info">
                Tap share &amp; "Add to Home Screen"
              </div>
            </div>
          )}

          <div className="flex-grow-1 py-3 px-3 px-md-4 bg-light">
            <Outlet />
          </div>

          {/* Spacer for Bottom Nav */}
          <div className="mobile-bottom-spacer d-md-none" style={{ height: '80px', flexShrink: 0 }}></div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;
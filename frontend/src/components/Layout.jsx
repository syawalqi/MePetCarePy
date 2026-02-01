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
    Menu,
    X,
    PlusCircle
  } from 'lucide-react';
  const Layout = () => {
  const { profile, logout, deferredPrompt, handleInstallClick } = useAuth();
  const location = useLocation();

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
    <nav className="bottom-nav d-md-none d-flex justify-content-around align-items-center px-2">
      {filteredMenu.slice(0, 5).map((item) => ( // Limit to 5 items for mobile spacing
        <Link
          key={item.path}
          to={item.path}
          className={`bottom-nav-item d-flex flex-column align-items-center text-decoration-none ${location.pathname === item.path ? 'active' : ''
            }`}
        >
          {React.cloneElement(item.icon, { size: 24, strokeWidth: location.pathname === item.path ? 2.5 : 2 })}
          <span className="mt-1" style={{ fontSize: '0.7rem' }}>{item.name}</span>
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
        <main className="col-md-9 ms-sm-auto col-lg-10 app-main">

          {/* PWA Install Prompt (Mobile Top) */}
          {deferredPrompt && (
            <div className="d-md-none px-3 pt-3">
              <button
                onClick={handleInstallClick}
                className="btn btn-success w-100 shadow-sm d-flex align-items-center justify-content-center gap-2"
              >
                <PlusCircle size={18} />
                <span>Instal Aplikasi</span>
              </button>
            </div>
          )}

          {/* iOS Instructions */}
          {isIOS && !deferredPrompt && (
            <div className="d-md-none px-3 pt-3">
              <div className="alert alert-info py-2 small mb-0 text-center">
                Tap share &amp; "Add to Home Screen"
              </div>
            </div>
          )}

          <div className="container-fluid py-2 px-0 px-md-3">
            <Outlet />
          </div>

          <div className="mobile-bottom-spacer d-md-none"></div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;
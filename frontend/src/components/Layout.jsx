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
  X
} from 'lucide-react';

const Layout = () => {
  const { profile, logout, deferredPrompt, handleInstallClick } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const menuItems = [
    { name: 'Home', path: '/', icon: <Home size={20} />, roles: ['ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF'] },
    { name: 'Owners', path: '/owners', icon: <Users size={20} />, roles: ['ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF'] },
    { name: 'Patients', path: '/patients', icon: <PawPrint size={20} />, roles: ['ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF'] },
    { name: 'Staff', path: '/staff', icon: <UserCog size={20} />, roles: ['ADMINISTRATOR'] },
    { name: 'Financial Reports', path: '/reports', icon: <BarChart3 size={20} />, roles: ['ADMINISTRATOR'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(profile?.role));

  if (!profile) return <Outlet />;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const SidebarContent = () => (
    <div className="position-sticky pt-3 h-100 d-flex flex-column">
      <div className="px-4 mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="text-primary fw-bold mb-0">MePetCare</h4>
          <small className="text-muted">{profile.role}</small>
        </div>
        <button className="btn d-md-none p-0" onClick={closeSidebar}>
          <X size={24} />
        </button>
      </div>
      
      <ul className="nav flex-column px-3">
        {filteredMenu.map((item) => (
          <li className="nav-item mb-1" key={item.path}>
            <Link 
              to={item.path} 
              onClick={closeSidebar}
              className={`nav-link d-flex align-items-center gap-3 py-2 px-3 rounded ${
                location.pathname === item.path ? 'active bg-primary text-white shadow-sm' : 'text-dark'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <hr className="mx-3 mt-4" />
      
      <div className="px-3 mt-auto mb-4">
        {/* PWA Install Button */}
        {deferredPrompt && (
          <button 
            onClick={handleInstallClick} 
            className="btn btn-success btn-sm w-100 d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm"
          >
            <PlusCircle size={16} />
            <span>Install App</span>
          </button>
        )}

        {isIOS && !deferredPrompt && (
          <div className="p-2 bg-info bg-opacity-10 rounded x-small text-center mb-3 border border-info border-opacity-25">
            <small className="text-info-emphasis">To install: Tap share and "Add to Home Screen"</small>
          </div>
        )}

        <div className="p-3 bg-light rounded small mb-3">
          <div className="fw-bold text-truncate">{profile.full_name}</div>
          <div className="text-muted text-truncate">{profile.email}</div>
        </div>
        <button 
          onClick={logout} 
          className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="container-fluid p-0">
      {/* Mobile Header */}
      <header className="navbar sticky-top bg-white shadow-sm d-md-none px-3 py-2">
        <button className="navbar-toggler border-0 p-0" type="button" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <span className="navbar-brand fw-bold text-primary m-0">MePetCare</span>
        <div style={{ width: 24 }}></div> {/* Spacer */}
      </header>

      <div className="row g-0">
        {/* Desktop Sidebar */}
        <nav className="col-md-3 col-lg-2 d-none d-md-block bg-white sidebar border-end min-vh-100 p-0">
          <SidebarContent />
        </nav>

        {/* Mobile Sidebar (Offcanvas Simulation) */}
        {isSidebarOpen && (
          <>
            <div 
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 z-3 d-md-none" 
              onClick={closeSidebar}
            ></div>
            <nav 
              className="position-fixed top-0 start-0 h-100 bg-white z-3 shadow-lg d-md-none animate-slide-in"
              style={{ width: '280px' }}
            >
              <SidebarContent />
            </nav>
          </>
        )}

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content flex-grow-1">
          <div className="container-fluid py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Users, 
  PawPrint, 
  UserCog, 
  BarChart3, 
  LogOut,
  PlusCircle
} from 'lucide-react';

const Layout = () => {
  const { profile, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Home', path: '/', icon: <Home size={20} />, roles: ['ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF'] },
    { name: 'Owners', path: '/owners', icon: <Users size={20} />, roles: ['ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF'] },
    { name: 'Patients', path: '/patients', icon: <PawPrint size={20} />, roles: ['ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF'] },
    { name: 'Staff', path: '/staff', icon: <UserCog size={20} />, roles: ['ADMINISTRATOR'] },
    { name: 'Financial Reports', path: '/reports', icon: <BarChart3 size={20} />, roles: ['ADMINISTRATOR'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(profile?.role));

  if (!profile) return <Outlet />;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-white sidebar collapse border-end p-0">
          <div className="position-sticky pt-3">
            <div className="px-4 mb-4">
              <h4 className="text-primary fw-bold">MePetCare</h4>
              <small className="text-muted">{profile.role}</small>
            </div>
            
            <ul className="nav flex-column px-3">
              {filteredMenu.map((item) => (
                <li className="nav-item mb-1" key={item.path}>
                  <Link 
                    to={item.path} 
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
            
            <div className="px-3 mt-auto">
              <div className="p-3 bg-light rounded small mb-3">
                <div className="fw-bold text-truncate">{profile.full_name}</div>
                <div className="text-muted text-truncate">{profile.email}</div>
              </div>
              <button 
                onClick={logout} 
                className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2 mb-4"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
          <div className="py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

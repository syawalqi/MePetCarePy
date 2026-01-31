import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { 
  Users, 
  PawPrint, 
  PlusCircle, 
  ClipboardList, 
  BadgeDollarSign 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardHome = () => {
  const { profile } = useAuth();
  
  const actions = [
    { title: 'New Owner', path: '/owners/new', icon: <Users className="text-primary" />, roles: ['ADMINISTRATOR', 'SUPPORT_STAFF'] },
    { title: 'New Patient', path: '/patients/new', icon: <PawPrint className="text-success" />, roles: ['ADMINISTRATOR', 'SUPPORT_STAFF'] },
    { title: 'Manage Staff', path: '/staff', icon: <ClipboardList className="text-info" />, roles: ['ADMINISTRATOR'] },
    { title: 'Financials', path: '/reports', icon: <BadgeDollarSign className="text-warning" />, roles: ['ADMINISTRATOR'] },
  ];

  const filteredActions = actions.filter(action => action.roles.includes(profile?.role));

  return (
    <div className="container py-2">
      <div className="mb-5">
        <h1 className="display-5 fw-bold">Welcome back, {profile?.full_name.split(' ')[0]}!</h1>
        <p className="lead text-muted">What would you like to do today?</p>
      </div>

      <div className="row g-4">
        {filteredActions.map((action) => (
          <div className="col-md-6 col-lg-3" key={action.path}>
            <Link to={action.path} className="text-decoration-none text-dark">
              <div className="card h-100 p-4 text-center hover-shadow transition-all border-0 shadow-sm">
                <div className="mb-3">
                  {React.cloneElement(action.icon, { size: 48 })}
                </div>
                <h5 className="fw-bold">{action.title}</h5>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row mt-5">
        <div className="col-md-8">
          <div className="card p-4 bg-white shadow-sm border-0 h-100">
            <h5 className="fw-bold mb-4">Quick Links</h5>
            <div className="list-group list-group-flush">
              <Link to="/owners" className="list-group-item list-group-item-action py-3 border-0 rounded mb-2 bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <span>View All Owners</span>
                  <PlusCircle size={18} className="text-muted" />
                </div>
              </Link>
              <Link to="/patients" className="list-group-item list-group-item-action py-3 border-0 rounded mb-2 bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <span>View All Patients</span>
                  <PlusCircle size={18} className="text-muted" />
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 bg-primary text-white shadow-sm border-0 h-100">
            <h5 className="fw-bold mb-3">Clinic Status</h5>
            <div className="mb-4">
              <small className="d-block opacity-75">Current Role</small>
              <span className="h4 fw-bold">{profile?.role}</span>
            </div>
            <div className="mt-auto">
              <p className="small mb-0 opacity-75">MePetCarePy internal management system.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

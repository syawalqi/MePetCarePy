import React, { useEffect, useState } from 'react';
import { ownerService } from '../api/ownerService';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, User, Phone, Mail, ChevronRight, Search } from 'lucide-react';

const OwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const isManagement = ['ADMINISTRATOR', 'SUPPORT_STAFF'].includes(profile?.role);

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      const response = await ownerService.getOwners();
      setOwners(response.data);
    } catch (error) {
      console.error('Error loading owners:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOwners = owners.filter(owner => 
    owner.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.phone_number.includes(searchTerm)
  );

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Loading owners directory...</p>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Owners Directory</h2>
          <p className="text-muted mb-0">Manage clinic clients and contact information</p>
        </div>
        {isManagement && (
          <Link to="/owners/new" className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm">
            <Plus size={18} />
            <span>Register New Owner</span>
          </Link>
        )}
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <div className="input-group">
            <span className="input-group-text bg-transparent border-0">
              <Search size={18} className="text-muted" />
            </span>
            <input 
              type="text" 
              className="form-control border-0 shadow-none" 
              placeholder="Search by name or phone number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted small text-uppercase">
              <tr>
                <th className="px-4 py-3">Owner Name</th>
                <th className="py-3">Contact Details</th>
                <th className="py-3 text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOwners.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-5 text-muted">
                    No owners found matching your search.
                  </td>
                </tr>
              ) : filteredOwners.map((owner) => (
                <tr key={owner.id}>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light rounded-circle p-2 text-primary">
                        <User size={20} />
                      </div>
                      <div className="fw-bold">{owner.full_name}</div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="d-flex flex-column gap-1 small">
                      <div className="d-flex align-items-center gap-2">
                        <Phone size={14} className="text-muted" />
                        <span>{owner.phone_number}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <Mail size={14} />
                        <span>{owner.email || 'No email provided'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="text-end px-4 py-3">
                    <Link 
                      to={`/owners/${owner.id}`} 
                      className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
                    >
                      <span>View Profile</span>
                      <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerList;

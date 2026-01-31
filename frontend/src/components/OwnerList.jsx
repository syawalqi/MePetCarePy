import React, { useEffect, useState } from 'react';
import { ownerService } from '../api/ownerService';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OwnerList = () => {
  const [owners, setOwners] = useState([]);
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

  if (loading) return <div>Loading owners...</div>;

  return (
    <div className="owner-list">
      <h2>Owners</h2>
      {isManagement && (
        <Link to="/owners/new" className="button">Register New Owner</Link>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.id}>
              <td>{owner.full_name}</td>
              <td>{owner.phone_number}</td>
              <td>{owner.email}</td>
              <td>
                <Link to={`/owners/${owner.id}`}>View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerList;
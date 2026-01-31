import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ownerService } from '../api/ownerService';
import { useAuth } from '../context/AuthContext';

const OwnerDetails = () => {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const isManagement = ['ADMINISTRATOR', 'SUPPORT_STAFF'].includes(profile?.role);
  const canViewRecords = ['ADMINISTRATOR', 'VETERINARIAN'].includes(profile?.role);

  useEffect(() => {
    loadOwner();
  }, [id]);

  const loadOwner = async () => {
    try {
      const response = await ownerService.getOwner(id);
      setOwner(response.data);
    } catch (error) {
      console.error('Error loading owner:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!owner) return <div>Owner not found</div>;

  return (
    <div className="owner-details">
      <h2>Owner Profile</h2>
      <div className="card">
        <p><strong>Name:</strong> {owner.full_name}</p>
        <p><strong>Phone:</strong> {owner.phone_number}</p>
        <p><strong>Email:</strong> {owner.email || 'N/A'}</p>
        <p><strong>Address:</strong> {owner.address || 'N/A'}</p>
      </div>
      
      <h3>Registered Pets</h3>
      {isManagement && (
        <Link to={`/patients/new?owner_id=${owner.id}`} className="button">Add New Pet</Link>
      )}
      
      <div className="patient-grid">
        {owner.patients && owner.patients.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {owner.patients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.species}</td>
                  <td>{patient.breed}</td>
                  <td>
                    {canViewRecords ? (
                      <Link to={`/patients/${patient.id}`}>View Health Record</Link>
                    ) : (
                      <span>No permission to view record</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No pets registered for this owner.</p>
        )}
      </div>
      <br />
      <Link to="/owners">Back to Owners List</Link>
    </div>
  );
};

export default OwnerDetails;
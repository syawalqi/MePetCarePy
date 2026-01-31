import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { patientService } from '../api/patientService';
import PatientTimeline from './PatientTimeline';
import { useAuth } from '../context/AuthContext';

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  const canEdit = ['ADMINISTRATOR', 'VETERINARIAN'].includes(profile?.role);

  useEffect(() => {
    if (id) {
      loadPatient();
    }
  }, [id]);

  const loadPatient = async () => {
    try {
      const response = await patientService.getPatient(id);
      setPatient(response.data);
    } catch (error) {
      console.error("Error loading patient:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading patient profile...</div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <div className="patient-details">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Patient Profile: {patient.name}</h2>
        {canEdit && (
          <Link to={`/patients/${id}/records/new`} className="button">Add SOAP Note</Link>
        )}
      </div>

      <div className="card" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee' }}>
        <p><strong>Species:</strong> {patient.species}</p>
        <p><strong>Breed:</strong> {patient.breed || 'Unknown'}</p>
        <p><strong>Date of Birth:</strong> {patient.date_of_birth || 'Not recorded'}</p>
        <p><strong>Owner:</strong> <Link to={`/owners/${patient.owner_id}`}>View Owner Profile</Link></p>
      </div>

      <PatientTimeline patientId={id} />
      
      <br />
      <Link to="/patients">Back to Patient List</Link>
    </div>
  );
};

export default PatientDetails;

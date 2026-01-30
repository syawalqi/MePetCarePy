import React, { useEffect, useState } from 'react';
import { patientService } from '../api/patientService';
import { Link } from 'react-router-dom';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await patientService.getPatients();
      setPatients(response.data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading patients...</div>;

  return (
    <div className="patient-list">
      <h2>All Patients</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Species</th>
            <th>Breed</th>
            <th>Owner ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.species}</td>
              <td>{patient.breed}</td>
              <td>{patient.owner_id}</td>
              <td>
                <Link to={`/patients/${patient.id}`}>View Profile</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientList;

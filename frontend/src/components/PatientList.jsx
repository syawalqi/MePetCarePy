import React, { useEffect, useState } from 'react';
import { patientService } from '../api/patientService';
import { Link } from 'react-router-dom';
import { PawPrint, Dog, Cat, Mouse, Search, ChevronRight } from 'lucide-react';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSpeciesIcon = (species) => {
    const s = species.toLowerCase();
    if (s.includes('dog')) return <Dog size={20} className="text-primary" />;
    if (s.includes('cat')) return <Cat size={20} className="text-info" />;
    return <PawPrint size={20} className="text-muted" />;
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Retrieving patient records...</p>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Patient Registry</h2>
          <p className="text-muted mb-0">Complete list of animals registered at the clinic</p>
        </div>
        <Link to="/patients/new" className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm">
          <PawPrint size={18} />
          <span>New Patient</span>
        </Link>
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
              placeholder="Search by name or species..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {filteredPatients.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            No patients found.
          </div>
        ) : filteredPatients.map((patient) => (
          <div className="col-md-6 col-lg-4" key={patient.id}>
            <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light rounded-p-2 p-2">
                      {getSpeciesIcon(patient.species)}
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0">{patient.name}</h5>
                      <span className="badge bg-light text-dark small">{patient.species}</span>
                    </div>
                  </div>
                  <Link to={`/patients/${patient.id}`} className="text-muted">
                    <ChevronRight size={20} />
                  </Link>
                </div>
                
                <div className="small text-muted mb-3">
                  <div className="mb-1"><strong>Breed:</strong> {patient.breed || 'Unknown'}</div>
                  <div><strong>DOB:</strong> {patient.date_of_birth || 'Not recorded'}</div>
                </div>

                <Link 
                  to={`/patients/${patient.id}`} 
                  className="btn btn-sm btn-outline-primary w-100 mt-2"
                >
                  Open Medical Record
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientList;
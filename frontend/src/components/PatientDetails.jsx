import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { patientService } from '../api/patientService';
import PatientTimeline from './PatientTimeline';
import InvoiceForm from './InvoiceForm';
import InvoiceList from './InvoiceList';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, Receipt, Calendar, Info, User } from 'lucide-react';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
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

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-2">Loading medical records...</p>
    </div>
  );
  
  if (!patient) return <div className="alert alert-danger">Patient not found</div>;

  return (
    <div className="container-fluid">
      <button onClick={() => navigate(-1)} className="btn btn-link text-muted d-flex align-items-center gap-2 mb-4 p-0">
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="row g-4 mb-5">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">{patient.name}'s Medical Timeline</h2>
            {canEdit && (
              <Link to={`/patients/${id}/records/new`} className="btn btn-success d-flex align-items-center gap-2">
                <Plus size={18} />
                <span>Add SOAP Note</span>
              </Link>
            )}
          </div>
          
          <PatientTimeline patientId={id} />
        </div>

        <div className="col-lg-4">
          {/* Patient Info Card */}
          <div className="card shadow-sm border-0 mb-4 overflow-hidden">
            <div className="bg-primary px-4 py-3 text-white">
              <h5 className="mb-0 d-flex align-items-center gap-2">
                <Info size={18} />
                <span>Patient Information</span>
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="mb-3">
                <label className="text-muted small uppercase fw-bold d-block">Species / Breed</label>
                <div className="h6">{patient.species} • {patient.breed || 'Unknown'}</div>
              </div>
              <div className="mb-3">
                <label className="text-muted small uppercase fw-bold d-block d-flex align-items-center gap-1">
                  <Calendar size={12} />
                  <span>Date of Birth</span>
                </label>
                <div className="h6">{patient.date_of_birth || 'Not recorded'}</div>
              </div>
              <div className="mt-4 pt-3 border-top">
                <Link to={`/owners/${patient.owner_id}`} className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
                  <User size={14} />
                  <span>View Owner Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Billing Actions */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Receipt size={18} className="text-success" />
                  <span>Billing</span>
                </h5>
                <button 
                  onClick={() => setShowInvoiceForm(!showInvoiceForm)}
                  className={`btn btn-sm ${showInvoiceForm ? 'btn-light' : 'btn-primary shadow-sm'}`}
                >
                  {showInvoiceForm ? "Cancel" : "Create Invoice"}
                </button>
              </div>

              {showInvoiceForm && (
                <div className="mt-4">
                  <InvoiceForm 
                    patientId={id} 
                    onSuccess={() => {
                      setShowInvoiceForm(false);
                      setRefreshKey(old => old + 1);
                    }} 
                  />
                </div>
              )}

              <InvoiceList key={refreshKey} patientId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
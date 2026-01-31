import React, { useEffect, useState } from 'react';
import { medicalRecordService } from '../api/medicalRecordService';

const PatientTimeline = ({ patientId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      loadHistory();
    }
  }, [patientId]);

  const loadHistory = async () => {
    try {
      const response = await medicalRecordService.getPatientHistory(patientId);
      setRecords(response.data);
    } catch (error) {
      console.error("Error loading patient history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading history...</div>;

  return (
    <div className="patient-timeline">
      <h3>Clinical History</h3>
      {records.length === 0 ? (
        <p>No medical records found for this patient.</p>
      ) : (
        <div className="timeline-list">
          {records.map((record) => (
            <div key={record.id} className="record-card" style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
              <div className="record-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', marginBottom: '10px' }}>
                <span className="record-date"><strong>Date:</strong> {new Date(record.created_at).toLocaleString()}</span>
                <span className="record-id">#MR-{record.id}</span>
              </div>
              
              <div className="vitals-row" style={{ backgroundColor: '#f9f9f9', padding: '5px 10px', borderRadius: '4px', marginBottom: '10px', fontSize: '0.9em' }}>
                <strong>Vitals: </strong>
                {record.weight && <span>Weight: {record.weight}kg | </span>}
                {record.temperature && <span>Temp: {record.temperature}°F | </span>}
                {record.heart_rate && <span>HR: {record.heart_rate}bpm | </span>}
                {record.respiration_rate && <span>RR: {record.respiration_rate}bpm</span>}
                {!record.weight && !record.temperature && !record.heart_rate && !record.respiration_rate && <span>Not recorded</span>}
              </div>

              <div className="soap-container">
                {record.subjective && <div className="soap-item"><strong>Subjective:</strong> <p>{record.subjective}</p></div>}
                {record.objective && <div className="soap-item"><strong>Objective:</strong> <p>{record.objective}</p></div>}
                {record.assessment && <div className="soap-item"><strong>Assessment:</strong> <p>{record.assessment}</p></div>}
                {record.plan && <div className="soap-item"><strong>Plan:</strong> <p>{record.plan}</p></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientTimeline;

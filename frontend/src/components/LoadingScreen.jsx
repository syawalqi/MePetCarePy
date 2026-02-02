import React from 'react';
import { Activity } from 'lucide-react';

const LoadingScreen = ({ message = "Memuat data..." }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 w-100">
      <div className="position-relative mb-4">
        {/* Animated outer ring */}
        <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem', borderWidth: '0.25em' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        {/* Pulsing heart/medical icon in center */}
        <div className="position-absolute top-50 start-50 translate-middle text-primary animate-pulse">
          <Activity size={24} />
        </div>
      </div>
      <h6 className="fw-bold text-dark mb-1">{message}</h6>
      <p className="text-muted small">MePetCare Clinic Management</p>
      
      <style>{`
        @keyframes pulse-soft {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.7; }
        }
        .animate-pulse {
          animation: pulse-soft 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;

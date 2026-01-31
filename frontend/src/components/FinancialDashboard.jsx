import React, { useEffect, useState } from 'react';
import { invoiceService } from '../api/invoiceService';
import { useAuth } from '../context/AuthContext';

const FinancialDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  const isAdmin = profile?.role === 'ADMINISTRATOR';

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin, date]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await invoiceService.getMonthlyReport(date.year, date.month);
      setStats(response.data);
    } catch (error) {
      console.error("Error loading financial reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await invoiceService.getMonthlyReportPDF(date.year, date.month);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Financial_Report_${date.year}_${date.month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to download PDF report");
    }
  };

  if (!isAdmin) return <div className="alert alert-warning">Access Denied: Administrator role required.</div>;

  return (
    <div className="financial-dashboard mt-4">
      <div className="card shadow-sm p-4 bg-light border-0">
        <h2 className="mb-4 text-primary">Financial Summary</h2>
        
        <div className="row mb-4 align-items-end">
          <div className="col-md-3">
            <label className="form-label fw-bold small uppercase">Year</label>
            <select 
              className="form-select" 
              value={date.year} 
              onChange={(e) => setDate({...date, year: parseInt(e.target.value)})}
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold small uppercase">Month</label>
            <select 
              className="form-select" 
              value={date.month} 
              onChange={(e) => setDate({...date, month: parseInt(e.target.value)})}
            >
              {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{new Date(0, m-1).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Calculating monthly reports...</p>
          </div>
        ) : stats && (
          <>
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm text-center p-4" style={{ backgroundColor: '#e7f3ff' }}>
                  <h6 className="text-muted text-uppercase mb-2">Total Monthly Earnings</h6>
                  <div className="display-5 fw-bold text-dark">${stats.total_earnings.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm text-center p-4" style={{ backgroundColor: '#f0fdf4' }}>
                  <h6 className="text-muted text-uppercase mb-2">Unique Patients Billed</h6>
                  <div className="display-5 fw-bold text-dark">{stats.total_patients}</div>
                </div>
              </div>
            </div>
            
            <div className="text-end">
              <button onClick={handleDownloadPDF} className="btn btn-outline-primary shadow-sm">
                <span className="me-2">📥</span> Download PDF Report
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialDashboard;

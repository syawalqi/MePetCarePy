import React, { useEffect, useState } from 'react';
import { invoiceService } from '../api/invoiceService';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Download, Calendar as CalendarIcon, Users, BadgeDollarSign, UserCheck } from 'lucide-react';
import LoadingScreen from './LoadingScreen';

const FinancialDashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  const hasAccess = ['SUPERADMIN', 'ADMINISTRATOR'].includes(profile?.role);

  useEffect(() => {
    if (hasAccess) {
      loadStats();
    }
  }, [hasAccess, date]);

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
      link.setAttribute('download', `Laporan_Keuangan_${date.year}_${date.month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Gagal mengunduh laporan PDF.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  if (!hasAccess) return (
    <div className="container py-5 text-center">
      <div className="alert alert-warning d-inline-block">Akses Ditolak: Diperlukan peran Administrator atau SuperAdmin.</div>
    </div>
  );

  return (
    <div className="container-fluid pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Ringkasan Keuangan</h2>
          <p className="text-muted small mb-0">Pantau pendapatan dan statistik pasien bulanan</p>
        </div>
        <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
          <BarChart3 size={28} />
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4 bg-white">
        <div className="card-body p-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label small fw-bold text-uppercase text-muted">Tahun</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><CalendarIcon size={16} /></span>
                <select 
                  className="form-select bg-light border-0 fw-medium" 
                  value={date.year} 
                  onChange={(e) => setDate({...date, year: parseInt(e.target.value)})}
                >
                  {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold text-uppercase text-muted">Bulan</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><CalendarIcon size={16} /></span>
                <select 
                  className="form-select bg-light border-0 fw-medium" 
                  value={date.month} 
                  onChange={(e) => setDate({...date, month: parseInt(e.target.value)})}
                >
                  {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{new Date(0, m-1).toLocaleString('id-ID', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingScreen message="Menghitung laporan bulanan..." />
      ) : stats && (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm bg-primary text-white overflow-hidden">
                <div className="card-body p-4 position-relative">
                  <div className="position-absolute end-0 top-0 opacity-25 me-3 mt-3">
                    <BadgeDollarSign size={48} />
                  </div>
                  <h6 className="text-white text-opacity-75 text-uppercase fw-bold small mb-2">Total Pendapatan Bulanan</h6>
                  <div className="display-6 fw-bold mb-0">{formatCurrency(stats.total_earnings)}</div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm bg-white overflow-hidden border-start border-success border-4">
                <div className="card-body p-4 position-relative">
                  <div className="position-absolute end-0 top-0 opacity-10 me-3 mt-3 text-success">
                    <UserCheck size={48} />
                  </div>
                  <h6 className="text-muted text-uppercase fw-bold small mb-2">Pasien Unik yang Ditagih</h6>
                  <div className="display-6 fw-bold text-dark">{stats.total_patients}</div>
                  <p className="text-muted small mb-0 mt-2">Jumlah pasien yang melakukan transaksi lunas.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-md-end">
            <button 
              onClick={handleDownloadPDF} 
              className="btn btn-outline-primary btn-lg px-4 shadow-sm fw-bold d-inline-flex align-items-center gap-2 rounded-pill"
            >
              <Download size={20} />
              <span>Unduh Laporan PDF</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FinancialDashboard;
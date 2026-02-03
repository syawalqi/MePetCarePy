import React, { useState } from 'react';
import { supabase } from '../../api/supabase';
import { userService } from '../../api/userService';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Activity } from 'lucide-react';
import LoadingScreen from '../common/LoadingScreen';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Create Session in Backend
      await userService.createSession(data.session.access_token);

      navigate('/');
    } catch (err) {
      setError(err.message || "Gagal masuk ke sistem.");
      setLoading(false);
    }
  };

  if (loading && !error) return (
    <div className="vh-100 d-flex align-items-center bg-white">
      <LoadingScreen message="Masuk ke sistem..." />
    </div>
  );

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-white bg-md-light">
      {/* Full white background on mobile, light gray on desktop */}
      <div className="card shadow-lg border-0 w-100" style={{ maxWidth: '400px', borderRadius: '1rem' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-5">
            <div className="bg-primary d-inline-flex p-3 rounded-circle text-white mb-3 shadow-sm">
              <Activity size={32} />
            </div>
            <h2 className="fw-bold mb-1">MePetCare</h2>
            <p className="text-muted small">Sistem Manajemen Klinik Hewan</p>
          </div>

          {error && <div className="alert alert-danger small mb-4">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase text-secondary" style={{ fontSize: '0.75rem' }}>Alamat Email</label>
              <div className="input-group input-group-lg shadow-sm border rounded overflow-hidden">
                <span className="input-group-text bg-white border-0 ps-3">
                  <Mail size={20} className="text-muted" />
                </span>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  className="form-control border-0 shadow-none ps-2"
                  placeholder="nama@klinik.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="form-label small fw-bold text-uppercase text-secondary" style={{ fontSize: '0.75rem' }}>Kata Sandi</label>
              <div className="input-group input-group-lg shadow-sm border rounded overflow-hidden">
                <span className="input-group-text bg-white border-0 ps-3">
                  <Lock size={20} className="text-muted" />
                </span>
                <input
                  type="password"
                  autoComplete="current-password"
                  className="form-control border-0 shadow-none ps-2"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 py-3 fw-bold shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : 'Masuk'}
            </button>
          </form>

          <div className="text-center mt-5">
            <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
              &copy; {new Date().getFullYear()} MePetCarePy
            </small>
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
              Khusus Staf Terdaftar
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
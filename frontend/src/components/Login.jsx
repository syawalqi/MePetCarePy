import React, { useState } from 'react';
import { supabase } from '../api/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Activity } from 'lucide-react';

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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg border-0" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="bg-primary d-inline-flex p-3 rounded-circle text-white mb-3 shadow">
              <Activity size={32} />
            </div>
            <h2 className="fw-bold">MePetCare</h2>
            <p className="text-muted">Clinic Internal Management</p>
          </div>

          {error && <div className="alert alert-danger small mb-4">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-bold uppercase">Email Address</label>
              <div className="input-group shadow-sm border rounded">
                <span className="input-group-text bg-white border-0">
                  <Mail size={18} className="text-muted" />
                </span>
                <input 
                  type="email" 
                  className="form-control border-0 py-2 shadow-none"
                  placeholder="name@clinic.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold uppercase">Password</label>
              <div className="input-group shadow-sm border rounded">
                <span className="input-group-text bg-white border-0">
                  <Lock size={18} className="text-muted" />
                </span>
                <input 
                  type="password" 
                  className="form-control border-0 py-2 shadow-none"
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2 shadow-sm fw-bold" 
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : 'Sign In'}
            </button>
          </form>
          
          <div className="text-center mt-4">
            <small className="text-muted">For authorized clinical staff only.</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
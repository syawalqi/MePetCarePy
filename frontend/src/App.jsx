import { Routes, Route, Link } from 'react-router-dom'
import OwnerList from './components/OwnerList'
import OwnerForm from './components/OwnerForm'
import OwnerDetails from './components/OwnerDetails'
import PatientList from './components/PatientList'
import PatientForm from './components/PatientForm'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

const Navigation = () => {
  const { profile, logout } = useAuth();
  
  return (
    <header className="app-header">
      <h1>MePetCarePy</h1>
      <nav>
        <Link to="/">Home</Link> | 
        <Link to="/owners">Owners</Link> | 
        <Link to="/patients">Patients</Link>
        {profile && (
          <span style={{ marginLeft: '20px' }}>
            {profile.full_name} ({profile.role}) 
            <button onClick={logout} style={{ marginLeft: '10px' }}>Logout</button>
          </span>
        )}
      </nav>
    </header>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navigation />
        <main className="app-main">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes - All Staff */}
            <Route element={<ProtectedRoute allowedRoles={['ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF']} />}>
              <Route path="/" element={<h2>Dashboard</h2>} />
              <Route path="/owners" element={<OwnerList />} />
              <Route path="/owners/:id" element={<OwnerDetails />} />
              <Route path="/patients" element={<PatientList />} />
            </Route>

            {/* Protected Routes - Management (Admin/Staff) */}
            <Route element={<ProtectedRoute allowedRoles={['ADMINISTRATOR', 'SUPPORT_STAFF']} />}>
              <Route path="/owners/new" element={<OwnerForm />} />
              <Route path="/patients/new" element={<PatientForm />} />
            </Route>
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
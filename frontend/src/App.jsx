import { Routes, Route, Link } from 'react-router-dom'
import OwnerList from './components/OwnerList'
import OwnerForm from './components/OwnerForm'
import OwnerDetails from './components/OwnerDetails'
import PatientList from './components/PatientList'
import PatientForm from './components/PatientForm'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>MePetCarePy</h1>
        <nav>
          <Link to="/">Home</Link> | 
          <Link to="/owners">Owners</Link> | 
          <Link to="/patients">Patients</Link>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<h2>Welcome to MePetCarePy Animal Clinic Management</h2>} />
          <Route path="/owners" element={<OwnerList />} />
          <Route path="/owners/new" element={<OwnerForm />} />
          <Route path="/owners/:id" element={<OwnerDetails />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/patients/:id" element={<h2>Patient Detail (Coming Soon)</h2>} />
        </Routes>
      </main>
    </div>
  )
}

export default App

import { Routes, Route, Link } from 'react-router-dom'
import OwnerList from './components/OwnerList'
import OwnerForm from './components/OwnerForm'
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
          <Route path="/patients" element={<h2>Patients Listing (Coming Soon)</h2>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
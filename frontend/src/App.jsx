import React from 'react'
import { Routes, Route } from 'react-router-dom'
import OwnerList from './components/OwnerList'
import OwnerForm from './components/OwnerForm'
import OwnerDetails from './components/OwnerDetails'
import PatientList from './components/PatientList'
import PatientForm from './components/PatientForm'
import PatientDetails from './components/PatientDetails'
import MedicalRecordForm from './components/MedicalRecordForm'
import StaffList from './components/StaffList'
import StaffForm from './components/StaffForm'
import FinancialDashboard from './components/FinancialDashboard'
import DashboardHome from './components/DashboardHome'
import Layout from './components/Layout'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import UpdatePrompt from './components/UpdatePrompt'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <UpdatePrompt />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Main Application Layout */}
        <Route element={<Layout />}>

          {/* Protected Routes - All Staff */}
          <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN', 'SUPPORT_STAFF']} />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/owners" element={<OwnerList />} />
            <Route path="/owners/:id" element={<OwnerDetails />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
          </Route>

          {/* Protected Routes - Management (Admin/Staff) */}
          <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'ADMINISTRATOR', 'SUPPORT_STAFF']} />}>
            <Route path="/owners/new" element={<OwnerForm />} />
            <Route path="/owners/edit/:id" element={<OwnerForm />} />
            <Route path="/patients/new" element={<PatientForm />} />
          </Route>

          {/* Protected Routes - Clinical Only */}
          <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'ADMINISTRATOR', 'VETERINARIAN']} />}>
            <Route path="/patients/:id/records/new" element={<MedicalRecordForm />} />
          </Route>

          {/* Protected Routes - Admin Only */}
          <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'ADMINISTRATOR']} />}>
            <Route path="/staff" element={<StaffList />} />
            <Route path="/reports" element={<FinancialDashboard />} />
          </Route>

          {/* Protected Routes - SuperAdmin Only */}
          <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN']} />}>
            <Route path="/staff/new" element={<StaffForm />} />
          </Route>

        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
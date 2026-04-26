import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AiChat from './pages/AiChat';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children, roles }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/login" />;
  return children;
};

function AppContent() {
  const { token } = useAuth();
  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient" element={
          <PrivateRoute roles={['patient']}>
            <PatientDashboard />
          </PrivateRoute>
        } />
        <Route path="/doctor" element={
          <PrivateRoute roles={['doctor']}>
            <DoctorDashboard />
          </PrivateRoute>
        } />
        <Route path="/chat" element={
  <PrivateRoute roles={['patient', 'doctor', 'admin']}>
    <AiChat />
  </PrivateRoute>
} />
        <Route path="/admin" element={
          <PrivateRoute roles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
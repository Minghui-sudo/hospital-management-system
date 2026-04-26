import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [message, setMessage] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchUsers();
    fetchAppointments();
    fetchAuditLog();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', { headers });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/appointments', { headers });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAuditLog = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/audit-log', { headers });
      setAuditLog(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { headers });
      setMessage('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      setMessage('Failed to delete user.');
    }
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '1rem'
  };

  const tabStyle = (active) => ({
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderBottom: active ? '3px solid #1e40af' : '3px solid transparent',
    backgroundColor: 'transparent',
    color: active ? '#1e40af' : '#6b7280',
    cursor: 'pointer',
    fontWeight: active ? '600' : '400',
    fontSize: '1rem'
  });

  const roleColor = (role) => {
    if (role === 'admin') return { backgroundColor: '#ede9fe', color: '#5b21b6' };
    if (role === 'doctor') return { backgroundColor: '#d1fae5', color: '#065f46' };
    return { backgroundColor: '#dbeafe', color: '#1e40af' };
  };

  return (
    <div style={{ backgroundColor: '#f0f9ff', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>Admin Dashboard</h2>

        {message && (
          <div style={{
            padding: '0.75rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            backgroundColor: message.includes('success') ? '#d1fae5' : '#fee2e2',
            color: message.includes('success') ? '#065f46' : '#dc2626'
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
          <button style={tabStyle(activeTab === 'users')} onClick={() => setActiveTab('users')}>All Users</button>
          <button style={tabStyle(activeTab === 'appointments')} onClick={() => setActiveTab('appointments')}>All Appointments</button>
          <button style={tabStyle(activeTab === 'audit')} onClick={() => setActiveTab('audit')}>Audit Log</button>
        </div>

        {activeTab === 'users' && (
  <div>
    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Total users: {users.length}</p>
    {['admin', 'doctor', 'patient'].map(role => (
      <div key={role} style={{ marginBottom: '2rem' }}>
        <h3 style={{
          color: 'white',
          backgroundColor: role === 'admin' ? '#5b21b6' : role === 'doctor' ? '#065f46' : '#1e40af',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          textTransform: 'capitalize'
        }}>
          {role}s ({users.filter(u => u.role === role).length})
        </h3>
        {users.filter(u => u.role === role).map(u => (
          <div key={u.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 0.25rem', fontWeight: '600' }}>{u.name}</p>
              <p style={{ margin: '0 0 0.25rem', color: '#6b7280', fontSize: '0.875rem' }}>{u.email}</p>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.75rem' }}>
                Joined: {new Date(u.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => deleteUser(u.id)}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    ))}
  </div>
)}

        {activeTab === 'appointments' && (
          <div>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Total appointments: {appointments.length}</p>
            {appointments.map(apt => (
              <div key={apt.id} style={cardStyle}>
                <p><strong>Patient:</strong> {apt.patient_name}</p>
                <p><strong>Doctor:</strong> {apt.doctor_name}</p>
                <p><strong>Date:</strong> {new Date(apt.appointment_date).toLocaleString()}</p>
                <p><strong>Status:</strong> <span style={{
                  marginLeft: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  backgroundColor: apt.status === 'confirmed' ? '#d1fae5' : apt.status === 'cancelled' ? '#fee2e2' : '#fef3c7',
                  color: apt.status === 'confirmed' ? '#065f46' : apt.status === 'cancelled' ? '#dc2626' : '#92400e'
                }}>{apt.status}</span></p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Total actions: {auditLog.length}</p>
            {auditLog.map(log => (
              <div key={log.id} style={{ ...cardStyle, padding: '1rem' }}>
                <p style={{ margin: '0 0 0.25rem' }}><strong>{log.name}</strong> ({log.email})</p>
                <p style={{ margin: '0 0 0.25rem', color: '#374151' }}>{log.action}</p>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.875rem' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
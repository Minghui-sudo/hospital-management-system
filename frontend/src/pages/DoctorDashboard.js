import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { token } = useAuth();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');
  const [recordData, setRecordData] = useState({
    patient_id: '',
    diagnosis: '',
    prescription: ''
  });
  const [message, setMessage] = useState('');
  const [patientSearch, setPatientSearch] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors/patients', { headers });
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors/appointments', { headers });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/doctors/appointments/${id}`, { status }, { headers });
      setMessage('Status updated successfully!');
      fetchAppointments();
    } catch (err) {
      setMessage('Update failed.');
    }
  };

  const handleAddRecord = async (e) => {
  e.preventDefault();
  if (!recordData.patient_id) {
    setMessage('Please select a patient first.');
    return;
  }
  try {
    await axios.post('http://localhost:5000/api/doctors/records', {
      patient_id: parseInt(recordData.patient_id),
      diagnosis: recordData.diagnosis,
      prescription: recordData.prescription
    }, { headers });
    setMessage('Medical record added successfully!');
    setRecordData({ patient_id: '', diagnosis: '', prescription: '' });
    setPatientSearch('');
  } catch (err) {
    setMessage(err.response?.data?.message || 'Failed to add record.');
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

  const btnStyle = (color) => ({
    padding: '0.25rem 0.75rem',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    marginRight: '0.5rem',
    backgroundColor: color,
    color: 'white',
    fontSize: '0.875rem'
  });

  return (
    <div style={{ backgroundColor: '#f0f9ff', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>Doctor Dashboard</h2>

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
          <button style={tabStyle(activeTab === 'appointments')} onClick={() => setActiveTab('appointments')}>Appointments</button>
          <button style={tabStyle(activeTab === 'patients')} onClick={() => setActiveTab('patients')}>My Patients</button>
          <button style={tabStyle(activeTab === 'records')} onClick={() => setActiveTab('records')}>Add Medical Record</button>
        </div>

        {activeTab === 'appointments' && (
          <div>
            {appointments.length === 0 ? (
              <div style={cardStyle}><p style={{ color: '#6b7280' }}>No appointments found.</p></div>
            ) : (
              appointments.map(apt => (
                <div key={apt.id} style={cardStyle}>
                  <p><strong>Patient:</strong> {apt.patient_name}</p>
                  <p><strong>Blood Type:</strong> {apt.blood_type || 'N/A'}</p>
                  <p><strong>Phone:</strong> {apt.phone || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(apt.appointment_date).toLocaleString()}</p>
                  <p><strong>Status:</strong> <span style={{
                    marginLeft: '0.5rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    backgroundColor: apt.status === 'confirmed' ? '#d1fae5' : apt.status === 'cancelled' ? '#fee2e2' : '#fef3c7',
                    color: apt.status === 'confirmed' ? '#065f46' : apt.status === 'cancelled' ? '#dc2626' : '#92400e'
                  }}>{apt.status}</span></p>
                  {apt.notes && <p><strong>Notes:</strong> {apt.notes}</p>}
                  <div style={{ marginTop: '0.75rem' }}>
                    <button style={btnStyle('#10b981')} onClick={() => updateStatus(apt.id, 'confirmed')}>Confirm</button>
                    <button style={btnStyle('#ef4444')} onClick={() => updateStatus(apt.id, 'cancelled')}>Cancel</button>
                    <button style={btnStyle('#6b7280')} onClick={() => updateStatus(apt.id, 'completed')}>Complete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'patients' && (
          <div>
            {patients.length === 0 ? (
              <div style={cardStyle}><p style={{ color: '#6b7280' }}>No patients found.</p></div>
            ) : (
              patients.map(p => (
                <div key={p.id} style={cardStyle}>
                  <p><strong>Name:</strong> {p.name}</p>
                  <p><strong>Email:</strong> {p.email}</p>
                  <p><strong>Phone:</strong> {p.phone || 'N/A'}</p>
                  <p><strong>Blood Type:</strong> {p.blood_type || 'N/A'}</p>
                  <p><strong>Date of Birth:</strong> {p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'records' && (
  <div style={cardStyle}>
    <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>Add Medical Record</h3>
    <form onSubmit={handleAddRecord}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Search Patient</label>
        <input
          type="text"
          placeholder="Type patient name..."
          value={patientSearch}
          onChange={(e) => setPatientSearch(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box', marginBottom: '0.5rem' }}
        />
        {patientSearch && (
          <div style={{ border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: 'white', maxHeight: '150px', overflowY: 'auto' }}>
            {patients
              .filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()))
              .map(p => (
                <div
                  key={p.patient_id}
                  onMouseDown={() => {
  setRecordData({ ...recordData, patient_id: p.patient_id });
  setPatientSearch(p.name);
}}
                  style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' }}
                >
                  {p.name} - {p.email}
                </div>
              ))}
          </div>
        )}
        {recordData.patient_id && (
          <p style={{ color: '#065f46', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Selected: {patients.find(p => p.patient_id === recordData.patient_id)?.name}
          </p>
        )}
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Diagnosis</label>
        <textarea
          value={recordData.diagnosis}
          onChange={(e) => setRecordData({ ...recordData, diagnosis: e.target.value })}
          rows="3"
          required
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Prescription</label>
        <textarea
          value={recordData.prescription}
          onChange={(e) => setRecordData({ ...recordData, prescription: e.target.value })}
          rows="3"
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }}
        />
      </div>
      <button type="submit" style={{
        backgroundColor: '#1e40af',
        color: 'white',
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        fontSize: '1rem'
      }}>
        Add Record
      </button>
    </form>
  </div>
)}
      </div>
    </div>
  );
};

export default DoctorDashboard;
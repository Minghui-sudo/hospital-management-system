import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PatientDashboard = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [records, setRecords] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [bookingData, setBookingData] = useState({
    doctor_id: '',
    appointment_date: '',
    notes: ''
  });
  const [message, setMessage] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
    fetchDoctors();
    fetchRecords();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients/profile', { headers });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients/appointments', { headers });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients/doctors', { headers });
      setDoctorsList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients/records', { headers });
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/patients/appointments', bookingData, { headers });
      setMessage('Appointment booked successfully!');
      fetchAppointments();
      setBookingData({ doctor_id: '', appointment_date: '', notes: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed.');
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

  return (
    <div style={{ backgroundColor: '#f0f9ff', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>Patient Dashboard</h2>

        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
          <button style={tabStyle(activeTab === 'profile')} onClick={() => setActiveTab('profile')}>My Profile</button>
          <button style={tabStyle(activeTab === 'appointments')} onClick={() => setActiveTab('appointments')}>My Appointments</button>
          <button style={tabStyle(activeTab === 'book')} onClick={() => setActiveTab('book')}>Book Appointment</button>
          <button style={tabStyle(activeTab === 'records')} onClick={() => setActiveTab('records')}>My Records</button>
        </div>

        {activeTab === 'profile' && profile && (
          <div style={cardStyle}>
            <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>Personal Information</h3>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Phone</label>
              <input
                type="text"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Address</label>
              <input
                type="text"
                value={profile.address || ''}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Blood Type</label>
              <select
                value={profile.blood_type || ''}
                onChange={(e) => setProfile({ ...profile, blood_type: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }}
              >
                <option value="">-- Select --</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Date of Birth</label>
              <input
                type="date"
                value={profile.date_of_birth ? profile.date_of_birth.split('T')[0] : ''}
                onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }}
              />
            </div>
            <button
              onClick={async () => {
                try {
                  await axios.put('http://localhost:5000/api/patients/profile', profile, { headers });
                  setMessage('Profile updated successfully!');
                } catch (err) {
                  setMessage('Update failed.');
                }
              }}
              style={{
                backgroundColor: '#1e40af',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Save Changes
            </button>
            {message && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                backgroundColor: message.includes('success') ? '#d1fae5' : '#fee2e2',
                color: message.includes('success') ? '#065f46' : '#dc2626'
              }}>
                {message}
              </div>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            {appointments.length === 0 ? (
              <div style={cardStyle}><p style={{ color: '#6b7280' }}>No appointments found.</p></div>
            ) : (
              appointments.map(apt => (
                <div key={apt.id} style={cardStyle}>
                  <p><strong>Doctor:</strong> {apt.doctor_name}</p>
                  <p><strong>Specialization:</strong> {apt.specialization}</p>
                  <p><strong>Date:</strong> {new Date(apt.appointment_date).toLocaleString()}</p>
                  <p><strong>Status:</strong>
                    <span style={{
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      backgroundColor: apt.status === 'confirmed' ? '#d1fae5' : apt.status === 'cancelled' ? '#fee2e2' : '#fef3c7',
                      color: apt.status === 'confirmed' ? '#065f46' : apt.status === 'cancelled' ? '#dc2626' : '#92400e'
                    }}>
                      {apt.status}
                    </span>
                  </p>
                  {apt.notes && <p><strong>Notes:</strong> {apt.notes}</p>}
                  {apt.status === 'pending' && (
                    <button
                      onClick={async () => {
                        try {
                          await axios.put(
                            `http://localhost:5000/api/patients/appointments/${apt.id}/cancel`,
                            {},
                            { headers }
                          );
                          setMessage('Appointment cancelled successfully!');
                          fetchAppointments();
                        } catch (err) {
                          setMessage('Cancel failed.');
                        }
                      }}
                      style={{
                        marginTop: '0.5rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'book' && (
          <div style={cardStyle}>
            <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>Book an Appointment</h3>
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
            <form onSubmit={handleBooking}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Select Doctor</label>
                <select
                  value={bookingData.doctor_id}
                  onChange={(e) => setBookingData({ ...bookingData, doctor_id: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }}
                >
                  <option value="">-- Select a doctor --</option>
                  {doctorsList.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialization || 'General'}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Appointment Date</label>
                <input
                  type="datetime-local"
                  value={bookingData.appointment_date}
                  onChange={(e) => setBookingData({ ...bookingData, appointment_date: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Notes</label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
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
                Book Appointment
              </button>
            </form>
          </div>
        )}

        {activeTab === 'records' && (
          <div>
            {records.length === 0 ? (
              <div style={cardStyle}><p style={{ color: '#6b7280' }}>No medical records found.</p></div>
            ) : (
              records.map(rec => (
                <div key={rec.id} style={cardStyle}>
                  <p><strong>Doctor:</strong> {rec.doctor_name}</p>
                  <p><strong>Specialization:</strong> {rec.specialization}</p>
                  <p><strong>Diagnosis:</strong> {rec.diagnosis}</p>
                  <p><strong>Prescription:</strong> {rec.prescription || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(rec.record_date).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
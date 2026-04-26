import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{
      backgroundColor: '#1e40af',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.25rem' }}>
        Hospital Management System
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>Welcome, {user?.name}</span>
        <button
  onClick={() => navigate('/chat')}
  style={{
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    cursor: 'pointer'
  }}
>
  AI Assistant
</button>
        <span style={{
          backgroundColor: '#3b82f6',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.875rem'
        }}>
          {user?.role}
        </span>
        <button
          onClick={logout}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
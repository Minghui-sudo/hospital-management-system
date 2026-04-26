import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AiChat = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your medical assistant. You can describe your symptoms and I will suggest which department to visit. Please note this is not a substitute for professional medical advice.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/chat',
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I am unable to respond right now. Please try again later.'
      }]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f9ff', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>AI Medical Assistant</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Describe your symptoms and get suggestions on which department to visit.
        </p>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          height: '500px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '0.75rem 1rem',
                  borderRadius: msg.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                  backgroundColor: msg.role === 'user' ? '#1e40af' : '#f3f4f6',
                  color: msg.role === 'user' ? 'white' : '#374151',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem 1rem 1rem 0',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280'
                }}>
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div style={{
            padding: '1rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '0.75rem'
          }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms... (Press Enter to send)"
              rows="2"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                resize: 'none',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                backgroundColor: loading || !input.trim() ? '#93c5fd' : '#1e40af',
                color: 'white',
                border: 'none',
                padding: '0 1.5rem',
                borderRadius: '0.5rem',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
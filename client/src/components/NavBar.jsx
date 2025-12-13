// src/components/NavBar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import logoImage from '../assets/logo.jpeg';

export default function NavBar() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const nameRaw = localStorage.getItem('name') || 'Guest';

  // Capitalize name safely
  const name = String(nameRaw)
    .split(' ')
    .map(s => (s ? s[0].toUpperCase() + s.slice(1) : ''))
    .join(' ');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: 'linear-gradient(180deg, rgba(6,14,20,0.96), rgba(10,18,25,0.97))',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        zIndex: 50,
        boxSizing: 'border-box',
      }}
    >
      {/* LEFT: Logo + Title */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
          flexShrink: 0,
        }}
        title="Go to home"
      >
        <img
          src={logoImage}
          alt="Coders Club"
          style={{
            width: 36,
            height: 36,
            objectFit: 'contain',
            borderRadius: 6,
            boxShadow:
              '0 6px 18px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)',
          }}
        />

        <span
          style={{
            color: 'var(--pixel-gold, #ffcf5b)',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '0.02em',
            fontFamily: "'Press Start 2P', monospace",
            whiteSpace: 'nowrap',
          }}
        >
          CODERS CLUB
        </span>
      </div>

      {/* RIGHT: User / Auth */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexShrink: 1,
          maxWidth: '60%',
          color: '#dbe9f5',
          fontSize: 14,
          overflow: 'hidden',
        }}
      >
        {token ? (
          <>
            {/* Welcome text with truncation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                maxWidth: 220,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: 'monospace',
              }}
              title={name}
            >
              <span style={{ marginRight: 4 }}>Welcome,</span>
              <span
                style={{
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {name}
              </span>
            </div>

            {/* Admin button */}
            {role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '6px 10px',
                  borderRadius: 8,
                  color: 'var(--pixel-gold, #ffcf5b)',
                  cursor: 'pointer',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                }}
                title="Admin Dashboard"
              >
                Admin
              </button>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: 'none',
                color: '#dbe9f5',
                cursor: 'pointer',
                padding: '6px 8px',
                borderRadius: 8,
                fontSize: 13,
                whiteSpace: 'nowrap',
              }}
              title="Logout"
            >
              <LogOut style={{ width: 16, height: 16 }} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#dbe9f5',
                cursor: 'pointer',
                fontSize: 14,
                padding: '6px 8px',
              }}
            >
              Login
            </button>

            <button
              onClick={() => navigate('/register')}
              style={{
                background:
                  'linear-gradient(90deg, var(--accent, #14e1ea), #0fd1d9)',
                color: 'var(--deep-navy, #06121a)',
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Join Club
            </button>
          </>
        )}
      </div>
    </header>
  );
}
  
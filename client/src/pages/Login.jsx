// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logoImage from '../assets/logo.jpeg';
import { API_BASE } from '../config';

export default function Login({ onNavigate } = {}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      if (res.data.role) localStorage.setItem('role', res.data.role);
      if (res.data.name) localStorage.setItem('name', res.data.name);

      if (typeof onNavigate === 'function') onNavigate('home');
      else navigate('/');
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-app-bg text-foreground">
      {/* subtle ambient particles / glow layer */}
      <div className="absolute inset-0 pointer-events-none bg-particles opacity-30"></div>

      <div className="z-10 w-full max-w-md px-6">
        {/* logo */}
        <div className="flex justify-center mb-8">
          <img src={logoImage} alt="Coders Club Logo" className="w-40 h-40 object-contain" />
        </div>

        {/* card */}
        <div className="mx-auto bg-card-bg border border-card-border p-8 rounded-2xl shadow-card">
          <h2 className="pixel-font text-center text-pixel-gold uppercase tracking-wider text-lg mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded text-sm text-center mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* email */}
            <div>
              <label htmlFor="email" className="block text-xs text-muted mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
                className="w-full bg-transparent border-b border-b-input px-0 py-2 text-foreground placeholder:text-muted focus:outline-none focus:border-b-accent transition-colors"
              />
            </div>

            {/* password */}
            <div>
              <label htmlFor="password" className="block text-xs text-muted mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full bg-transparent border-b border-b-input px-0 py-2 text-foreground placeholder:text-muted focus:outline-none focus:border-b-accent transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-accent px-6 py-3 pixel-font text-sm text-deep-navy hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 rounded-sm"
            >
              {loading ? 'PLEASE WAIT...' : 'ENTER'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                if (typeof onNavigate === 'function') onNavigate('signup');
                else navigate('/register');
              }}
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              Don't have an account? Join now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

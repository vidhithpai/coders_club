// src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logoImage from '../assets/logo.jpeg';
import { API_BASE } from '../config';

export default function Register({ onNavigate } = {}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [leetcodeUsernameError, setLeetcodeUsernameError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLeetcodeUsernameError('');

    // local validation: require @mite.ac.in
    if (!email.trim().endsWith('@mite.ac.in')) {
      setError('Please use your @mite.ac.in email address.');
      return;
    }

    setLoading(true);
    try {
      const payload = { name, email, leetcodeUsername, password };
      const res = await axios.post(`${API_BASE}/api/auth/register`, payload);

      // if API returns success, navigate to login
      if (typeof onNavigate === 'function') onNavigate('login');
      else navigate('/login');
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Registration failed';
      // if API tells leetcode username is taken, show that specific error
      if (msg.toLowerCase().includes('leetcode') && msg.toLowerCase().includes('taken')) {
        setLeetcodeUsernameError(msg);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-app-bg text-foreground">
      <div className="w-full max-w-md px-6 z-10">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <img src={logoImage} alt="Coders Club Logo" className="w-40 h-40 object-contain" />
        </div>

        {/* Sign Up Card */}
        <div className="bg-card-bg border border-card-border p-8 rounded-2xl shadow-card">
          <h2 className="pixel-font text-xl text-center text-pixel-gold mb-8 uppercase">
            Join the Club
          </h2>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded text-sm text-center mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs text-muted mb-2 uppercase tracking-wider">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full bg-transparent border-b-2 border-slate-border px-0 py-2 text-foreground focus:border-b-accent focus:outline-none transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs text-muted mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mite.ac.in"
                required
                className="w-full bg-transparent border-b-2 border-slate-border px-0 py-2 text-foreground focus:border-b-accent focus:outline-none transition-colors"
              />
            </div>

            {/* LeetCode */}
            <div>
              <label htmlFor="leetcode" className="block text-xs text-muted mb-2 uppercase tracking-wider">
                LeetCode Username
              </label>
              <input
                id="leetcode"
                type="text"
                value={leetcodeUsername}
                onChange={(e) => {
                  setLeetcodeUsername(e.target.value);
                  setLeetcodeUsernameError('');
                }}
                placeholder="Enter your LeetCode username"
                required
                className={`w-full bg-transparent border-b-2 px-0 py-2 text-foreground focus:border-b-accent focus:outline-none transition-colors ${
                  leetcodeUsernameError ? 'border-red-500' : 'border-slate-border'
                }`}
              />
              {leetcodeUsernameError && (
                <p className="mt-1 text-sm text-red-500">{leetcodeUsernameError}</p>
              )}
            </div>

            {/* Password */}
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
                className="w-full bg-transparent border-b-2 border-slate-border px-0 py-2 text-foreground focus:border-b-accent focus:outline-none transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-deep-navy px-6 py-3 pixel-font text-xs hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 group mt-8 rounded-sm disabled:opacity-60"
            >
              {loading ? 'PLEASE WAIT...' : 'ENTER'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                if (typeof onNavigate === 'function') onNavigate('login');
                else navigate('/login');
              }}
              className="text-xs text-muted hover:text-accent transition-colors"
            >
              Already a member? Sign in
            </button>
          </div>
        </div>
      </div>
      {/* optional soft particles overlay - keep same class as login for consistent background */}
      <div className="absolute inset-0 pointer-events-none bg-particles opacity-30"></div>
    </div>
  );
}

import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { API_BASE } from '../config';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', leetcodeUsername: '', password: ''
    });
    const [error, setError] = useState('');
    const [leetcodeUsernameError, setLeetcodeUsernameError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLeetcodeUsernameError('');
        
        if (!formData.email.endsWith('@mite.ac.in')) {
            setError('Please use your @mite.ac.in email address.');
            return;
        }
        
        try {
            await axios.post(`${API_BASE}/api/auth/register`, formData);
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Registration failed';
            if (errorMessage === 'LeetCode username already taken.') {
                setLeetcodeUsernameError(errorMessage);
            } else {
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-2xl shadow-xl border border-surface-hover">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-white">Join the Club</h2>
                    <p className="mt-2 text-sm text-gray-400">Create your account to compete</p>
                </div>
                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded text-sm text-center">{error}</div>}
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                        <input
                            type="text"
                            required
                            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-surface-hover bg-background text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">MITE Email</label>
                        <input
                            type="email"
                            required
                            placeholder="example@mite.ac.in"
                            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-surface-hover bg-background text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">LeetCode Username</label>
                        <input
                            type="text"
                            required
                            className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${
                                leetcodeUsernameError ? 'border-red-500' : 'border-surface-hover'
                            } bg-background text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
                            value={formData.leetcodeUsername}
                            onChange={(e) => {
                                setFormData({ ...formData, leetcodeUsername: e.target.value });
                                setLeetcodeUsernameError('');
                            }}
                        />
                        {leetcodeUsernameError && (
                            <p className="mt-1 text-sm text-red-500">{leetcodeUsernameError}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Password</label>
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-surface-hover bg-background text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-secondary hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all"
                    >
                        Create Account
                    </button>
                </form>
                <div className="text-center">
                    <Link to="/login" className="text-sm text-secondary hover:text-purple-400">Already a member? Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;

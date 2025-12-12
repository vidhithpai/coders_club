import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('name', res.data.name);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-2xl shadow-xl border border-border-color">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-main">Welcome Back</h2>
                    <p className="mt-2 text-sm text-muted">Sign in to track your progress</p>
                </div>
                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded text-sm text-center">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="sr-only">Email address</label>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-surface-hover bg-background text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="sr-only">Password</label>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-surface-hover bg-background text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                    >
                        Sign in
                    </button>
                </form>
                <div className="text-center">
                    <Link to="/register" className="text-sm text-primary hover:text-primary/80">Don't have an account? Join now</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;

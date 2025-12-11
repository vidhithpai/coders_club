import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const NavBar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        navigate('/login');
    };

    return (
        <nav className="bg-surface border-b border-surface-hover sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            SafeCoders
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {token ? (
                            <>
                                <span className="text-gray-300 text-sm hidden sm:block">Welcome, {name}</span>
                                {role === 'admin' && (
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Admin
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="space-x-2">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Join Club
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;

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
        <nav className="bg-background/80 backdrop-blur-md border-b border-border-color sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center cursor-pointer gap-2" onClick={() => navigate('/')}>
                        <span className="text-primary font-mono font-bold text-xl">{"< />"}</span>
                        <span className="text-xl font-bold font-mono text-main">
                            SafeCoders
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {token ? (
                            <>
                                <span className="text-muted text-sm hidden sm:block">Welcome, {name}</span>
                                {role === 'admin' && (
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className="text-muted hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Admin
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-muted hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="space-x-4 flex items-center">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-muted hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="border border-border-color text-main hover:border-primary hover:text-primary hover:bg-primary/10 px-4 py-2 rounded-md text-sm font-medium transition-all"
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

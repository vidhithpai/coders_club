import { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import UserTable from '../components/UserTable';
import UserCard from '../components/UserCard';
import { ExternalLink, Loader2 } from 'lucide-react';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]); // [{id, name, leetcodeUsername, solvedToday, pointsToday}]
    const [dailyProblem, setDailyProblem] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const getCurrentUserId = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload).user.id;
        } catch (e) {
            return null;
        }
    };

    const currentUserId = getCurrentUserId();

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data.users || []);
            setDailyProblem(res.data.dailyProblem || null);
        } catch (err) {
            console.error(err);
            setError("Failed to load leaderboard. Is the server running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSafeSubmit = async () => {
        if (!currentUserId) return;
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/api/users/${currentUserId}/submit`, {}, {
                headers: { 'x-auth-token': token }
            });

            if (res.data.success) {
                alert(`Congrats! You earned ${res.data.pointsToday} points.`);
                fetchData(); // Refresh list
            } else {
                alert(res.data.message || "Verification failed. Did you solve the corect problem?");
            }
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data?.error || "Submission error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-white flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white pb-10">
            <NavBar />

            {error && (
                <div className="bg-red-500/10 border-b border-red-500/20 text-red-500 px-4 py-2 text-center text-sm">
                    {error}
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                        <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            Daily Challenge
                        </span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Solve the LeetCode problem of the day and race to the top of the leaderboard.
                    </p>
                </div>

                {/* Daily Problem Card */}
                <div className="bg-gradient-to-br from-surface to-surface-hover rounded-2xl p-6 mb-10 shadow-2xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-1">Today's Target</h2>
                            <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                                {dailyProblem?.title || "Waiting for Problem..."}
                            </div>
                            {dailyProblem?.slug && dailyProblem.slug !== "Not set" && (
                                <a
                                    href={`https://leetcode.com/problems/${dailyProblem.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    View on LeetCode <ExternalLink className="w-4 h-4 ml-1" />
                                </a>
                            )}
                        </div>

                        {submitting && (
                            <div className="mt-4 md:mt-0 flex items-center text-yellow-400 bg-yellow-400/10 px-4 py-2 rounded-lg">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Verifying Solution...
                            </div>
                        )}
                    </div>
                </div>

                {/* Leaderboard Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        Leaderboard <span className="ml-2 text-xs font-normal text-gray-500 bg-surface px-2 py-0.5 rounded">Top {users.length}</span>
                    </h2>

                    {/* Desktop Table */}
                    <div className="hidden sm:block">
                        <UserTable users={users} currentUserId={currentUserId} onSafeSubmit={handleSafeSubmit} />
                    </div>

                    {/* Mobile Cards */}
                    <div className="block sm:hidden space-y-4">
                        {users.map((user, index) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                rank={index + 1}
                                currentUserId={currentUserId}
                                onSafeSubmit={handleSafeSubmit}
                            />
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Home;

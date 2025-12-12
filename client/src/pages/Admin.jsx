import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { Settings, RefreshCw, Users, FileCheck } from 'lucide-react';
import { API_BASE } from '../config';
import styles from './admin.module.css'; // <-- IMPORTANT

const Admin = () => {
    const [slug, setSlug] = useState('');
    const [resetDaily, setResetDaily] = useState(false);
    const [message, setMessage] = useState('');
    const [stats, setStats] = useState({
        totalUsers: 0,
        submittedToday: 0
    });

    const token = localStorage.getItem('token');

    // -----------------------------
    // Set Daily Problem
    // -----------------------------
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${API_BASE}/api/admin/daily-problem`,
                { slug },
                { headers: { 'x-auth-token': token } }
            );

            setMessage('Daily problem updated successfully!');
            setSlug('');
            fetchStats();
        } catch (err) {
            setMessage('Error updating problem!');
        }
    };

    // -----------------------------
    // Reset Points
    // -----------------------------
    const handleResetPoints = async () => {
        try {
            const res = await axios.post(
                `${API_BASE}/api/admin/reset-points`,
                {},
                { headers: { 'x-auth-token': token } }
            );

            setMessage(`Reset points for ${res.data.count} users.`);
            setResetDaily(false);
        } catch (err) {
            setMessage('Error resetting points.');
        }
    };

    // -----------------------------
    // Fetch Stats
    // -----------------------------
    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/admin/stats`, {
                headers: { 'x-auth-token': token }
            });

            setStats({
                totalUsers: res.data.totalUsers || 0,
                submittedToday: res.data.submittedToday || 0
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // -----------------------------
    // UI RENDER
    // -----------------------------
    return (
        <>
            <NavBar />

            <main className={styles.adminPage}>
                <div className={styles.particles}></div>

                <div className={styles.container}>
                    {/* HEADER */}
                    <h1 className={styles.header}>ADMIN DASHBOARD</h1>
                    <div className={styles.headerUnderline}></div>

                    {/* STATS GRID */}
                    <div className={styles.statsGrid}>
                        {/* USERS */}
                        <div className={`${styles.statCard} ${styles.statCyan}`}>
                            <div className={styles.statRightOverlay}></div>
                            <div className="flex items-center gap-3">
                                <Users size={22} className="text-cyan-400" />
                                <span className="pixel-font text-xs text-cyan-400">
                                    TOTAL USERS
                                </span>
                            </div>
                            <div className={styles.statNumber}>
                                {stats.totalUsers.toLocaleString()}
                            </div>
                        </div>

                        {/* SUBMISSIONS */}
                        <div className={`${styles.statCard} ${styles.statGold}`}>
                            <div className={styles.statRightOverlay}></div>
                            <div className="flex items-center gap-3">
                                <FileCheck size={22} className="text-yellow-400" />
                                <span className="pixel-font text-xs text-yellow-400">
                                    TOTAL SUBMISSIONS TODAY
                                </span>
                            </div>
                            <div className={styles.statNumber}>
                                {stats.submittedToday.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* STATUS MESSAGE */}
                    {message && (
                        <p className="text-center text-sm text-green-400 mb-4 pixel-font">
                            {message}
                        </p>
                    )}

                    {/* SET PROBLEM PANEL */}
                    <div className={styles.panel}>
                        <div className="flex items-center gap-2 mb-6">
                            <Settings size={20} className="text-cyan-400" />
                            <h2 className="pixel-font text-cyan-400 text-sm">
                                SET NEW PROBLEM
                            </h2>
                        </div>

                        <form onSubmit={handleUpdate}>
                            <label className="pixel-font text-xs mb-2 block">
                                Problem Slug
                            </label>

                            <div className={styles.inputRow}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={slug}
                                    placeholder="two-sum"
                                    onChange={(e) => setSlug(e.target.value)}
                                    required
                                />

                                <button type="submit" className={styles.btnPrimary}>
                                    SET PROBLEM
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RESET POINTS PANEL */}
                    <div className={styles.panel}>
                        <div className="flex items-center gap-2 mb-6">
                            <RefreshCw size={20} className="text-yellow-400" />
                            <h2 className="pixel-font text-yellow-400 text-sm">
                                RESET POINTS
                            </h2>
                        </div>

                        <p className="text-gray-300 text-sm mb-4">
                            Reset all users' points to 0. This will not affect submission status or last update time.
                        </p>

                        <div className="flex items-center gap-3 mb-4">
                            <input
                                type="checkbox"
                                checked={resetDaily}
                                onChange={(e) => setResetDaily(e.target.checked)}
                            />
                            <label className="text-sm">
                                I confirm that I want to reset all user points to 0
                            </label>
                        </div>

                        <button
                            disabled={!resetDaily}
                            onClick={handleResetPoints}
                            className={styles.btnDanger}
                        >
                            RESET ALL POINTS
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Admin;

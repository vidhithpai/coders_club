import { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import UserTable from '../components/UserTable';
import UserCard from '../components/UserCard';
import { ExternalLink, Loader2 } from 'lucide-react';
import { API_BASE } from '../config';
import styles from './home.module.css';

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
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload).user.id;
    } catch (e) {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/users`);
      const filteredUsers = (res.data.users || []).filter((u) => u.role !== 'admin');
      setUsers(filteredUsers);
      setDailyProblem(res.data.dailyProblem || null);
    } catch (err) {
      console.error(err);
      setError('Failed to load leaderboard. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // optional: poll every minute: setInterval(fetchData, 60000)
  }, []);

  const handleSafeSubmit = async () => {
    if (!currentUserId) {
      alert('You must be logged in to submit.');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE}/api/users/${currentUserId}/submit`, {}, {
        headers: { 'x-auth-token': token }
      });

      if (res.data.success) {
        alert('Submission verified and points updated.');
        fetchData();
      } else {
        alert('No accepted submission found for today.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Submission error';
      // keep behavior similar to your current code
      console.log(errorMsg);
      alert(typeof errorMsg === 'string' ? errorMsg : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Get current user's solved status
  const currentUser = users.find((user) => user.id === currentUserId);
  const hasSolvedToday = currentUser?.solvedToday || false;

  if (loading) {
    return (
      <div className={`${styles.pageWrap} ${styles.center}`}>
        <NavBar />
        <div className={styles.loadingWrap}>
          <Loader2 className="w-12 h-12 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrap}>
      <NavBar />
        <br /><br />
      <main className={`${styles.container}`}>

        {/* Decorative particles / bg (scoped) */}
        <div className={styles.particles} />

        {/* Pixel Header */}
        <header className={styles.headerWrap}>
          <h1 className={styles.pixelTitle}>{'<'} CODE # COMPETE {'/>'}</h1>
          <p className={styles.subtitle}>Solve the LeetCode problem of the day and race to the top of the leaderboard.</p>
        </header>

        {/* Daily Problem Card */}
        <section className={styles.problemCard}>
          <div className={styles.problemInner}>
            <div className={styles.problemInfo}>
              <div className={styles.problemTag}>TODAY'S TARGET</div>
              <div className={styles.problemTitle}>{dailyProblem?.title || 'Waiting for Problem...'}</div>
            </div>

            <div className={styles.problemActions}>
              {submitting ? (
                <div className={styles.verifying}>
                  <Loader2 className="animate-spin" />
                  <span> Verifying Solution...</span>
                </div>
              ) : (
                <>
                  {/* Solve Now (optional action you can map) */}
                  <button
                    className={styles.btnSolve}
                    onClick={() => {
                      if (dailyProblem?.slug) {
                        window.open(`https://leetcode.com/problems/${dailyProblem.slug}`, '_blank');
                      }
                    }}
                  >
                    Solve Now
                  </button>

                  {!hasSolvedToday && currentUserId && (
                    <button
                      className={styles.btnSubmit}
                      onClick={handleSafeSubmit}
                      disabled={submitting}
                    >
                      Check &amp; Submit
                    </button>
                  )}
                  {hasSolvedToday && (
                    <div className={styles.solvedBadge}>Solved ✓</div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section className={styles.leaderboardSection}>
          <div className={styles.leaderHeader}>
            <h2 className={styles.leaderTitle}>Leaderboard</h2>
            <span className={styles.leaderTag}>Top {users.length}</span>
          </div>

          <div className={styles.leaderboardWrap}>
            {/* Desktop Table */}
            <div className={styles.tableWrap}>
              <UserTable users={users} currentUserId={currentUserId} />
            </div>

            {/* Mobile Cards (fallback) */}
            <div className={styles.cardsWrap}>
              {users.map((user, index) => (
                <UserCard key={user.id} user={user} rank={index + 1} currentUserId={currentUserId} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;

import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import styles from './UserTable.module.css';

/**
 * UserTable
 * Props:
 *  - users: array of user objects (each: id, name, leetcodeUsername, pointsToday, solvedToday, role)
 *  - currentUserId: id of the logged-in user (to highlight row)
 */
const UserTable = ({ users = [], currentUserId }) => {
  const filteredUsers = (users || []).filter(u => u.role !== 'admin');

  const fmt = (v) => {
    if (v == null) return '0';
    return Number(v).toLocaleString();
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.title}>LEADERBOARD</div>
      </div>

      {/* Scrollable rows container (manual scroll only) */}
      <div className={styles.rowsContainer} role="list" aria-label="Leaderboard rows">
        {filteredUsers.map((user, idx) => {
          const rank = idx + 1;
          const isMe = user.id === currentUserId;
          const solved = !!user.solvedToday;

          const classes = [
            styles.row,
            rank === 1 ? styles.first : '',
            rank === 2 ? styles.second : '',
            isMe ? styles.me : ''
          ].join(' ');

          return (
            <div key={user.id} className={classes} role="listitem" tabIndex={0}>
              <div className={styles.left}>
                <div className={styles.rankCircle}>
                  <span className={styles.rankNumber}>{rank}</span>
                </div>
              </div>

              <div className={styles.center}>
                <div className={styles.name}>{user.name}</div>
                <div className={styles.handle}>@{user.leetcodeUsername}</div>
              </div>

              <div className={styles.right}>
                <div className={styles.points}>
                  {fmt(user.pointsToday ?? 0)} <span className={styles.pointsLabel}>PTS</span>
                </div>

                <div className={styles.statusWrap}>
                  {solved ? (
                    <div className={styles.solved}>
                      <CheckCircle className={styles.icon} />
                      <span>SOLVED</span>
                    </div>
                  ) : (
                    <div className={styles.unsolved}>
                      <XCircle className={styles.icon} />
                      <span>UNSOLVED</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserTable;

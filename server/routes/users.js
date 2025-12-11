const express = require('express');
const router = express.Router();
const { db, handleFirestoreError } = require('../firebase/firebaseAdmin');
const { checkLeetCode } = require('../services/leetcode');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Safe Submit Route
router.post('/:id/submit', auth, async (req, res) => {
    const userId = req.params.id;

    // Auth Check: User implies self, Admin can submit for anyone
    if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Unauthorized submission" });
    }

    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found" });
        }
        const userData = userDoc.data();

        if (userData.solvedToday) {
            return res.status(400).json({ message: "Already solved today!" });
        }

        // Get Daily Problem
        const settingsDoc = await db.collection('settings').doc('dailyProblem').get();
        if (!settingsDoc.exists) {
            return res.status(500).json({ error: "Daily problem not set by admin" });
        }
        const { slug } = settingsDoc.data(); // e.g., 'two-sum'

        // Check LeetCode
        const isSolved = await checkLeetCode(userData.leetcodeUsername, slug);

        if (isSolved) {
            // Calculate Points
            // We need to count how many have solved today to determine rank/points
            // This is a naive approach; strictly we should use a transaction or atomic increment, 
            // but for simplicity query count is okay for small scale.

            const solvedTodayQuery = await db.collection('users').where('solvedToday', '==', true).get();
            const rank = solvedTodayQuery.size + 1; // 1-based rank

            // Points logic: 1st=100, 2nd=95, etc. Min 10.
            let pointsEarned = 100 - (rank - 1) * 5;
            if (pointsEarned < 10) pointsEarned = 10;

            // Get current points and add new points (cumulative)
            const currentPoints = userData.pointsToday || 0;
            const newTotalPoints = currentPoints + pointsEarned;

            await userRef.update({
                solvedToday: true,
                lastUpdated: new Date(),
                pointsToday: newTotalPoints
            });

            return res.json({ 
                success: true, 
                pointsEarned: pointsEarned,
                pointsToday: newTotalPoints, 
                rank 
            });
        } else {
            return res.json({ success: false, message: "Use 'Safe Submit' only after solving on LeetCode." });
        }

    } catch (error) {
        const handledError = handleFirestoreError(error, 'User submission');
        console.error(handledError);
        if (error.code === 5 || error.code === 'NOT_FOUND') {
            res.status(503).json({ error: "Firestore database not found. Please check server logs for setup instructions." });
        } else if (error.code === 9 || error.code === 'FAILED_PRECONDITION') {
            res.status(503).json({ error: "Database index is building. Please wait a few minutes and try again." });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
});

// Get Leaderboard
router.get('/', async (req, res) => {
    try {
        // Fetch all users (no ordering to avoid composite index requirement)
        const snapshot = await db.collection('users').get();

        const users = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            users.push({
                id: doc.id,
                name: data.name,
                leetcodeUsername: data.leetcodeUsername,
                pointsToday: data.pointsToday || 0,
                solvedToday: data.solvedToday || false,
                lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : (data.lastUpdated || new Date(0))
            });
        });

        // Sort in memory: Primary by pointsToday (desc), secondary by lastUpdated (asc - earlier = better rank)
        users.sort((a, b) => {
            if (b.pointsToday !== a.pointsToday) {
                return b.pointsToday - a.pointsToday; // Higher points first
            }
            // If points are equal, earlier submission wins
            return a.lastUpdated.getTime() - b.lastUpdated.getTime();
        });

        // Remove lastUpdated from response (not needed by frontend)
        const cleanedUsers = users.map(({ lastUpdated, ...user }) => user);

        // Also fetch daily problem title to show on frontend
        const settingsDoc = await db.collection('settings').doc('dailyProblem').get();
        const dailyProblem = settingsDoc.exists ? settingsDoc.data() : { slug: "Not set", title: "Wait for Admin" };

        res.json({ users: cleanedUsers, dailyProblem });
    } catch (error) {
        const handledError = handleFirestoreError(error, 'Leaderboard fetch');
        console.error(handledError);
        if (error.code === 5 || error.code === 'NOT_FOUND') {
            res.status(503).json({ error: "Firestore database not found. Please check server logs for setup instructions." });
        } else if (error.code === 9 || error.code === 'FAILED_PRECONDITION') {
            res.status(503).json({ error: "Database index is building. Please wait a few minutes and try again." });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
});

module.exports = router;

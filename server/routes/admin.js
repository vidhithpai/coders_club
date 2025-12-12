const express = require('express');
const router = express.Router();
const { db, handleFirestoreError } = require('../firebase/firebaseAdmin');
const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Admin access required' });
        }
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token' });
    }
};

// Set Daily Problem
router.post('/daily-problem', authAdmin, async (req, res) => {
    const { slug, title } = req.body;
    if (!slug) return res.status(400).json({ error: "Slug is required" });

    try {
        await db.collection('settings').doc('dailyProblem').set({
            slug,
            title: title || slug,
            updatedAt: new Date()
        });

        // Reset submission status for all users (but keep cumulative points)
        // This allows users to submit for the new problem while preserving their total points
        const usersSnapshot = await db.collection('users').get();
        const batch = db.batch();
        usersSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, { 
                solvedToday: false,
                lastUpdated: null
            });
        });
        await batch.commit();

        res.json({ message: "Daily problem updated. Submission status reset for all users.", slug });
    } catch (error) {
        const handledError = handleFirestoreError(error, 'Admin daily problem update');
        console.error(handledError);
        if (error.code === 5 || error.code === 'NOT_FOUND') {
            res.status(503).json({ error: "Firestore database not found. Please check server logs for setup instructions." });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
});

// Reset Points Only (does not reset solvedToday or lastUpdated)
router.post('/reset-points', authAdmin, async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users').get();
        const batch = db.batch();
        let count = 0;
        
        usersSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, { pointsToday: 0 });
            count++;
        });
        
        await batch.commit();
        
        console.log(`Reset points for ${count} users`);
        res.json({ message: `Reset points for ${count} users`, count });
    } catch (error) {
        const handledError = handleFirestoreError(error, 'Admin reset points');
        console.error(handledError);
        if (error.code === 5 || error.code === 'NOT_FOUND') {
            res.status(503).json({ error: "Firestore database not found. Please check server logs for setup instructions." });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
});

// Admin Stats: total users and submissions today
router.get('/stats', authAdmin, async (_req, res) => {
    try {
        const usersSnapshot = await db.collection('users').where('role', '==', 'user').get();
        const totalUsers = usersSnapshot.size;

        const submittedSnapshot = await db.collection('users')
            .where('role', '==', 'user')
            .where('solvedToday', '==', true)
            .get();
        const submittedToday = submittedSnapshot.size;

        res.json({ totalUsers, submittedToday });
    } catch (error) {
        const handledError = handleFirestoreError(error, 'Admin stats');
        console.error(handledError);
        if (error.code === 5 || error.code === 'NOT_FOUND') {
            res.status(503).json({ error: "Firestore database not found. Please check server logs for setup instructions." });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
});

module.exports = router;

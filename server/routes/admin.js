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

        // Optional: Reset all users 'solvedToday' and 'pointsToday' when problem changes?
        // Or create a separate 'reset-day' endpoint. 
        // For this task, we'll assume the admin manually resets or we just set the problem.
        // Let's implement a 'reset' flag in the body to clear daily stats.

        if (req.body.resetDaily) {
            const usersSnapshot = await db.collection('users').get();
            const batch = db.batch();
            usersSnapshot.docs.forEach(doc => {
                batch.update(doc.ref, { solvedToday: false, pointsToday: 0 });
            });
            await batch.commit();
        }

        res.json({ message: "Daily problem updated", slug });
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

module.exports = router;

const express = require('express');
const router = express.Router();
const { db, handleFirestoreError } = require('../firebase/firebaseAdmin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, leetcodeUsername, password } = req.body;

        if (!email.endsWith('@mite.ac.in')) {
            return res.status(400).json({ error: "Email must be from @mite.ac.in domain" });
        }

        // Check if user exists
        const usersRef = db.collection('users');
        const emailSnapshot = await usersRef.where('email', '==', email).get();
        if (!emailSnapshot.empty) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Check if LeetCode username already exists
        const leetcodeSnapshot = await usersRef.where('leetcodeUsername', '==', leetcodeUsername).get();
        if (!leetcodeSnapshot.empty) {
            return res.status(400).json({ error: "LeetCode username already taken." });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = {
            name,
            email,
            leetcodeUsername,
            passwordHash,
            role: 'user', // Default role
            solvedToday: false,
            lastUpdated: new Date(),
            pointsToday: 0
        };

        const docRef = await usersRef.add(newUser); // Firestore auto-generates ID

        res.status(201).json({ message: "User registered successfully", userId: docRef.id });

    } catch (error) {
        const handledError = handleFirestoreError(error, 'Authentication');
        console.error(handledError);
        if (error.code === 5 || error.code === 'NOT_FOUND') {
            res.status(503).json({ error: "Firestore database not found. Please check server logs for setup instructions." });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).limit(1).get();

        if (snapshot.empty) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const doc = snapshot.docs[0];
        const user = doc.data();

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const payload = {
            user: {
                id: doc.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role, name: user.name });
            }
        );

    } catch (error) {
        const handledError = handleFirestoreError(error, 'Authentication');
        console.error(handledError);
        if (error.code === 5 || error.code === 'NOT_FOUND') {
            res.status(503).json({ error: "Firestore database not found. Please check server logs for setup instructions." });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
});

// Get Current User
router.get('/me', async (req, res) => {
    // Middleware should attach user to req
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        const doc = await db.collection('users').doc(userId).get();
        if (!doc.exists) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const user = doc.data();
        // Exclude password
        const { passwordHash, ...userInfo } = user;
        res.json(userInfo);

    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./firebase/firebaseAdmin');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

// Test Firestore connection before starting server
testConnection().then((connected) => {
    if (connected) {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } else {
        console.error('\n⚠️  Server not started due to Firestore connection issue.');
        console.error('Please create the Firestore database and restart the server.\n');
        process.exit(1);
    }
});

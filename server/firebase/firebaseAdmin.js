const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Replace literal "\n" in env with real newlines for the private key
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const databaseURL = process.env.FIREBASE_DATABASE_URL; // optional, but helps avoid misrouting
const databaseId = process.env.FIREBASE_DATABASE_ID || '(default)'; // Default database ID

if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase credentials missing in .env (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)");
}

// Prevent multiple initializations
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
        }),
        ...(databaseURL ? { databaseURL } : {}),
    });
}

// Initialize Firestore with explicit database ID if needed
const db = admin.firestore(databaseId !== '(default)' ? databaseId : undefined);

// Helper function to handle Firestore errors with better messages
const handleFirestoreError = (error, context = 'Firestore operation') => {
    if (error.code === 5 || error.code === 'NOT_FOUND') {
        const helpfulMessage = `
❌ Firestore Database NOT_FOUND Error

The Firestore database doesn't exist in your Firebase project "${projectId}".

To fix this:
1. Go to https://console.firebase.google.com/project/${projectId}/firestore
2. Click "Create database"
3. Choose "Start in Native mode" (or "Test mode" for development)
4. Select a location (choose closest to your users)
5. Click "Enable"

After creating the database, restart your server.

Context: ${context}
        `.trim();
        console.error(helpfulMessage);
        return new Error(helpfulMessage);
    }
    return error;
};

// Test Firestore connection on startup
const testConnection = async () => {
    try {
        // Try to access a collection (this will fail if database doesn't exist)
        // Using a test query that won't fail if collection is empty
        const testRef = db.collection('_test_connection');
        await testRef.limit(1).get();
        console.log('✅ Firestore connection successful');
        return true;
    } catch (error) {
        // Log full error details for debugging
        console.error('\n🔍 Error Details:');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        if (error.details) console.error('Error Details:', error.details);
        
        handleFirestoreError(error, 'Initial connection test');
        
        // Additional troubleshooting tips
        console.error('\n💡 Troubleshooting Tips:');
        console.error('1. Verify the database was created in Native mode (not Datastore mode)');
        console.error('2. Check that the service account has "Cloud Datastore User" or "Firebase Admin" role');
        console.error('3. Wait a few minutes if you just created the database (it may still be provisioning)');
        console.error('4. Verify your .env file has the correct FIREBASE_PROJECT_ID: ' + projectId);
        console.error('5. Check Firebase Console: https://console.firebase.google.com/project/' + projectId + '/firestore\n');
        
        return false;
    }
};

module.exports = { admin, db, handleFirestoreError, testConnection };

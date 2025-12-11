const { db } = require('../firebase/firebaseAdmin');
const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function createAdmin() {
    try {
        console.log('\n🔐 Create Admin User\n');
        
        const name = await question('Enter admin name: ');
        const email = await question('Enter admin email (must be @mite.ac.in): ');
        const leetcodeUsername = await question('Enter LeetCode username: ');
        const password = await question('Enter password: ');

        // Validate email
        if (!email.endsWith('@mite.ac.in')) {
            console.error('\n❌ Error: Email must be from @mite.ac.in domain');
            rl.close();
            process.exit(1);
        }

        // Check if user already exists
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();
        
        if (!snapshot.empty) {
            const existingUser = snapshot.docs[0];
            const userData = existingUser.data();
            
            console.log('\n⚠️  User already exists. Updating to admin role...');
            
            // Update existing user to admin
            await existingUser.ref.update({
                role: 'admin',
                name: name || userData.name,
                leetcodeUsername: leetcodeUsername || userData.leetcodeUsername
            });
            
            // Update password if provided
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(password, salt);
                await existingUser.ref.update({ passwordHash });
            }
            
            console.log('\n✅ Admin user updated successfully!');
            console.log(`   Email: ${email}`);
            console.log(`   User ID: ${existingUser.id}`);
        } else {
            // Create new admin user
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const newAdmin = {
                name,
                email,
                leetcodeUsername,
                passwordHash,
                role: 'admin',
                solvedToday: false,
                lastUpdated: new Date(),
                pointsToday: 0
            };

            const docRef = await usersRef.add(newAdmin);
            
            console.log('\n✅ Admin user created successfully!');
            console.log(`   Email: ${email}`);
            console.log(`   User ID: ${docRef.id}`);
        }

        console.log('\n📝 You can now login with these credentials.\n');
        
    } catch (error) {
        console.error('\n❌ Error creating admin user:', error.message);
        if (error.code === 5 || error.code === 'NOT_FOUND') {
            console.error('   Make sure Firestore database is created and accessible.');
        }
    } finally {
        rl.close();
    }
}

createAdmin();


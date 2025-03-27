const bcrypt = require('bcryptjs');

async function generateHash() {
    const plainPassword = "heimdall"; // Replace with the password you want to hash
    const saltRounds = 10; // Number of salt rounds for hashing
    
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        console.log('Hashed password:', hashedPassword);
    } catch (error) {
        console.error('Error generating hash:', error);
    }
}

generateHash();
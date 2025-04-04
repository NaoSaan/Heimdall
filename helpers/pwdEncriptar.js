const bcrypt = require('bcryptjs');

async function EncryptPWD(pwd) {
    const saltRounds = 10; // Number of salt rounds for hashing
    
    try {
        const hashedPassword = await bcrypt.hash(pwd, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error generating hash:', error);
    }
}

module.exports = EncryptPWD;
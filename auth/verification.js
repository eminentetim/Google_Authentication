// auth/verification.js
const jwt = require('jsonwebtoken');

const generateVerificationToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.email;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
};

module.exports = { generateVerificationToken, verifyToken };

// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    googleId: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Customer', customerSchema);

const passport = require('passport');
const Customer = require('../models/Customer');

// Google OAuth Strategy
require('./googleAuth');

// Microsoft Azure AD Strategy
require('./microsoftAuth');

// Facebook Strategy
require('./facebookAuth');

// Serialize user to session
passport.serializeUser((customer, done) => {
    done(null, customer.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const customer = await Customer.findById(id);
        done(null, customer);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
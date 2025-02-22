// auth/googleAuth.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Customer = require('../models/Customer');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if the customer already exists
        let customer = await Customer.findOne({ googleId: profile.id });

        if (!customer) {
            // Create a new customer
            customer = new Customer({
                googleId: profile.id,
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
            });
            await customer.save();
        }

        done(null, customer);
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((customer, done) => {
    done(null, customer.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const customer = await Customer.findById(id);
        done(null, customer);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;

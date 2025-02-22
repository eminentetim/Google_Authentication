const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const Customer = require('../models/Customer');

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID, // Replace with your Facebook App ID
    clientSecret: process.env.FACEBOOK_APP_SECRET, // Replace with your Facebook App Secret
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name'], // Requested fields from Facebook
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if the customer already exists
        let customer = await Customer.findOne({ facebookId: profile.id });

        if (!customer) {
            // Create a new customer
            customer = new Customer({
                facebookId: profile.id,
                email: profile.emails ? profile.emails[0].value : null, // Facebook may not always provide email
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

module.exports = passport;
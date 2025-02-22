const passport = require('passport');
const { OIDCStrategy } = require('passport-azure-ad');
const Customer = require('../models/Customer');

const clientID = process.env.MICROSOFT_CLIENT_ID; //  Azure AD app client ID
const clientSecret = process.env.MICROSOFT_CLIENT_SECRET; //  Azure AD app client secret
const tenantID = process.env.MICROSOFT_TENANT_ID; // Azure AD tenant ID
const redirectUri = 'http://localhost:3000/auth/microsoft/callback'; // Must match the redirect URI in Azure AD

passport.use(
    new OIDCStrategy(
        {
            identityMetadata: `https://login.microsoftonline.com/${tenantID}/v2.0/.well-known/openid-configuration`,
            clientID,
            clientSecret,
            responseType: 'code',
            responseMode: 'form_post',
            redirectUri,
            scope: ['openid', 'profile', 'email'],
            allowHttpForRedirectUrl: true, // Allow HTTP for local development
        },
        async (iss, sub, profile, accessToken, refreshToken, done) => {
            try {
                // Check if the customer already exists
                let customer = await Customer.findOne({ microsoftId: profile.oid });

                if (!customer) {
                    // Create a new customer
                    customer = new Customer({
                        microsoftId: profile.oid,
                        email: profile._json.email || profile.upn,
                        firstName: profile._json.given_name,
                        lastName: profile._json.family_name,
                    });
                    await customer.save();
                }

                done(null, customer);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

module.exports = passport;
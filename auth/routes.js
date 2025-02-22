const express = require('express');
const passport = require('./passportConfig'); // Import the combined Passport configuration
const Customer = require('../models/Customer');
const ShippingAddress = require('../models/ShippingAddress');
const { sendVerificationEmail } = require('./emailService');
const { generateVerificationToken, verifyToken } = require('./verification');

const router = express.Router();

// Google OAuth Routes
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        const { email, firstName, lastName } = req.user;

        try {
            // Check if the customer already exists
            let customer = await Customer.findOne({ email });

            if (!customer) {
                // Create a new customer if they don't exist
                customer = new Customer({
                    email,
                    firstName,
                    lastName,
                    isVerified: false, // New users need to verify their email
                });
                await customer.save();

                // Generate verification token
                const token = generateVerificationToken(email);
                const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

                // Send verification email
                sendVerificationEmail(email, verificationLink);

                // Notify the user that an email has been sent
                return res.send(`
                    <h1>Email Sent</h1>
                    <p>An email has been sent to <strong>${email}</strong>. Please check your inbox to verify your account.</p>
                    <p><a href="/">Return to Home</a></p>
                `);
            } else if (!customer.isVerified) {
                // If the customer exists but is not verified, resend the verification email
                const token = generateVerificationToken(email);
                const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

                sendVerificationEmail(email, verificationLink);

                return res.send(`
                    <h1>Email Sent</h1>
                    <p>An email has been sent to <strong>${email}</strong>. Please check your inbox to verify your account.</p>
                    <p><a href="/">Return to Home</a></p>
                `);
            } else {
                // If the customer is already verified, check if they have a shipping address
                const shippingAddress = await ShippingAddress.findOne({ customer: customer._id });

                if (shippingAddress) {
                    // If shipping address exists, redirect to account page
                    return res.redirect('/account');
                } else {
                    // If shipping address does not exist, redirect to shipping address form
                    return res.redirect('/shipping-address');
                }
            }
        } catch (error) {
            console.error('Error during Google authentication:', error);
            res.status(500).send('Internal Server Error');
        }
    }
);

// Microsoft OAuth Routes
router.get('/auth/microsoft',
    passport.authenticate('azuread-openidconnect', { scope: ['openid', 'profile', 'email'] })
);

router.post('/auth/microsoft/callback',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
    async (req, res) => {
        const { email, firstName, lastName } = req.user;

        try {
            // Check if the customer already exists
            let customer = await Customer.findOne({ email });

            if (!customer) {
                // Create a new customer if they don't exist
                customer = new Customer({
                    email,
                    firstName,
                    lastName,
                    isVerified: false, // New users need to verify their email
                });
                await customer.save();

                // Generate verification token
                const token = generateVerificationToken(email);
                const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

                // Send verification email
                sendVerificationEmail(email, verificationLink);

                // Notify the user that an email has been sent
                return res.send(`
                    <h1>Email Sent</h1>
                    <p>An email has been sent to <strong>${email}</strong>. Please check your inbox to verify your account.</p>
                    <p><a href="/">Return to Home</a></p>
                `);
            } else if (!customer.isVerified) {
                // If the customer exists but is not verified, resend the verification email
                const token = generateVerificationToken(email);
                const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

                sendVerificationEmail(email, verificationLink);

                return res.send(`
                    <h1>Email Sent</h1>
                    <p>An email has been sent to <strong>${email}</strong>. Please check your inbox to verify your account.</p>
                    <p><a href="/">Return to Home</a></p>
                `);
            } else {
                // If the customer is already verified, check if they have a shipping address
                const shippingAddress = await ShippingAddress.findOne({ customer: customer._id });

                if (shippingAddress) {
                    // If shipping address exists, redirect to account page
                    return res.redirect('/account');
                } else {
                    // If shipping address does not exist, redirect to shipping address form
                    return res.redirect('/shipping-address');
                }
            }
        } catch (error) {
            console.error('Error during Microsoft authentication:', error);
            res.status(500).send('Internal Server Error');
        }
    }
);

// Facebook OAuth Routes
router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] }) // Request email permission
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    async (req, res) => {
        const { email, firstName, lastName } = req.user;

        try {
            // Check if the customer already exists
            let customer = await Customer.findOne({ email });

            if (!customer) {
                // Create a new customer if they don't exist
                customer = new Customer({
                    email,
                    firstName,
                    lastName,
                    isVerified: false, // New users need to verify their email
                });
                await customer.save();

                // Generate verification token
                const token = generateVerificationToken(email);
                const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

                // Send verification email
                sendVerificationEmail(email, verificationLink);

                // Notify the user that an email has been sent
                return res.send(`
                    <h1>Email Sent</h1>
                    <p>An email has been sent to <strong>${email}</strong>. Please check your inbox to verify your account.</p>
                    <p><a href="/">Return to Home</a></p>
                `);
            } else if (!customer.isVerified) {
                // If the customer exists but is not verified, resend the verification email
                const token = generateVerificationToken(email);
                const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

                sendVerificationEmail(email, verificationLink);

                return res.send(`
                    <h1>Email Sent</h1>
                    <p>An email has been sent to <strong>${email}</strong>. Please check your inbox to verify your account.</p>
                    <p><a href="/">Return to Home</a></p>
                `);
            } else {
                // If the customer is already verified, check if they have a shipping address
                const shippingAddress = await ShippingAddress.findOne({ customer: customer._id });

                if (shippingAddress) {
                    // If shipping address exists, redirect to account page
                    return res.redirect('/account');
                } else {
                    // If shipping address does not exist, redirect to shipping address form
                    return res.redirect('/shipping-address');
                }
            }
        } catch (error) {
            console.error('Error during Facebook authentication:', error);
            res.status(500).send('Internal Server Error');
        }
    }
);

// Email Verification Route
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    const email = verifyToken(token);
    if (!email) {
        return res.status(400).send('Invalid or expired token');
    }

    try {
        // Mark customer as verified
        const customer = await Customer.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        if (!customer) {
            return res.status(404).send('Customer not found');
        }

        // Log the user in after verification
        req.login(customer, (err) => {
            if (err) {
                console.error('Error logging in:', err);
                return res.status(500).send('Internal Server Error');
            }

            // Check if the user has a shipping address
            ShippingAddress.findOne({ customer: customer._id })
                .then((shippingAddress) => {
                    if (shippingAddress) {
                        // If shipping address exists, redirect to account page
                        return res.redirect('/account');
                    } else {
                        // If shipping address does not exist, redirect to shipping address form
                        return res.redirect('/shipping-address');
                    }
                })
                .catch((error) => {
                    console.error('Error finding shipping address:', error);
                    return res.status(500).send('Internal Server Error');
                });
        });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Shipping Address Form
router.get('/shipping-address', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    res.send(`
        <h1>Update Shipping Address</h1>
        <form action="/shipping-address" method="POST">
            <input type="text" name="first_name" placeholder="First Name" required>
            <input type="text" name="last_name" placeholder="Last Name" required>
            <input type="text" name="phone_number" placeholder="Phone Number" required>
            <input type="text" name="delivery_address" placeholder="Delivery Address" required>
            <input type="text" name="state" placeholder="State" required>
            <input type="text" name="city" placeholder="City" required>
            <input type="text" name="country" placeholder="Country" required>
            <button type="submit">Submit</button>
        </form>
    `);
});

router.post('/shipping-address', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    const { first_name, last_name, phone_number, delivery_address, state, city, country } = req.body;

    try {
        // Find the customer
        const customer = await Customer.findById(req.user.id);
        if (!customer) {
            return res.status(404).send('Customer not found');
        }

        // Create or update shipping address
        const shippingAddress = await ShippingAddress.findOneAndUpdate(
            { customer: customer._id },
            {
                customer: customer._id,
                first_name,
                last_name,
                phone_number,
                delivery_address,
                state,
                city,
                country,
            },
            { upsert: true, new: true }
        );

        // Redirect to account page after updating shipping address
        res.redirect('/account');
    } catch (error) {
        console.error('Error updating shipping address:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Account Page
router.get('/account', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    try {
        // Find the customer and their shipping address
        const customer = await Customer.findById(req.user.id);
        const shippingAddress = await ShippingAddress.findOne({ customer: customer._id });

        if (!customer) {
            return res.status(404).send('Customer not found');
        }

        // Display account details
        res.send(`
            <h1>Welcome, ${customer.firstName} ${customer.lastName}</h1>
            <h2>Your Shipping Address:</h2>
            ${shippingAddress ? `
                <p><strong>Full Name:</strong> ${shippingAddress.first_name} ${shippingAddress.last_name}</p>
                <p><strong>Phone Number:</strong> ${shippingAddress.phone_number}</p>
                <p><strong>Delivery Address:</strong> ${shippingAddress.delivery_address}</p>
                <p><strong>State:</strong> ${shippingAddress.state}</p>
                <p><strong>City:</strong> ${shippingAddress.city}</p>
                <p><strong>Country:</strong> ${shippingAddress.country}</p>
            ` : '<p>No shipping address provided yet.</p>'}
            <p><a href="/shipping-address">Update Shipping Address</a></p>
            <p><a href="/logout">Logout</a></p>
        `);
    } catch (error) {
        console.error('Error fetching account details:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/');
    });
});

module.exports = router;
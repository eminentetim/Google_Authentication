// auth/routes.js
const express = require('express');
const passport = require('./googleAuth');
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
        // Generate verification token
        const token = generateVerificationToken(req.user.email);
        const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

        // Send verification email
        sendVerificationEmail(req.user.email, verificationLink);

        // Notify the user that an email has been sent
        res.send(`
            <h1>Email Sent</h1>
            <p>An email has been sent to <strong>${req.user.email}</strong>. Please check your inbox to verify your account.</p>
            <p><a href="/">Return to Home</a></p>
        `);
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

        // Redirect to shipping address form
        res.redirect('/shipping-address');
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Shipping Address Form
router.get('/shipping-address', (req, res) => {
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

        res.send('Shipping address updated successfully!');
    } catch (error) {
        console.error('Error updating shipping address:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
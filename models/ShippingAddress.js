// models/ShippingAddress.js
const mongoose = require('mongoose');

const shippingAddressSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    full_name: { type: String, required: false },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    delivery_address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
});

module.exports = mongoose.model('ShippingAddress', shippingAddressSchema);

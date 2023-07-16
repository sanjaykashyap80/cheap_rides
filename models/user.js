const mongoose = require('mongoose');

module.exports = mongoose.model('User',
    {
        email: String,
        password: String,
        fullName: String,
        phoneNumber: Number,
        otp: Number
    });
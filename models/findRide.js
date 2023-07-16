const mongoose = require('mongoose');

module.exports = mongoose.model('FindRide',
    {
        rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'RideOffer' },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        departure: String,
        destination: String,
        date: String, seats: Number,
        carName: String
    });
const mongoose = require('mongoose');

module.exports = mongoose.model('RideOffer',
 { departure: String, destination: String, date: String, seats: String, phoneNumber: Number, carName: String });
const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const rideOfferSchema = new mongoose.Schema({
  departure: String,
  destination: String,
  date: {
    type: Date,
    required: true,
  },
  bookedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  seats: Number,
  rs: Number,
  phoneNumber: Number,
  carName: String,
  departureCoordinates: coordinateSchema,
  destinationCoordinates: coordinateSchema,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('RideOffer', rideOfferSchema);
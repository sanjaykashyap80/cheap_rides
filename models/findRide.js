const mongoose = require('mongoose');

const findRideSchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'RideOffer' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  departure: String,
  destination: String,
  date: String,
  seats: Number,
  rs:Number,
  carName: String,
  // Fields for geospatial coordinates
  departureCoordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  destinationCoordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

// Index the geospatial fields for faster geospatial queries
findRideSchema.index({ departureCoordinates: '2dsphere' });
findRideSchema.index({ destinationCoordinates: '2dsphere' });

module.exports = mongoose.model('FindRide', findRideSchema);
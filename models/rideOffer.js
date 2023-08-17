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
  // date: String,
  date: {
    type: Date,
    required: true,
  },
  // bookedUsers: [String],
  bookedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  seats: Number,
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


// const mongoose = require('mongoose');

// const coordinateSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ['Point'],
//     required: true,
//   },
//   coordinates: {
//     type: [Number],
//     required: true,
//   },
// });

// const rideOfferSchema = new mongoose.Schema({
//   departure: String,
//   destination: String,
//   date: String,
//   seats: String,
//   phoneNumber: Number,
//   carName: String,
//   departureCoordinates: coordinateSchema,
//   destinationCoordinates: coordinateSchema,
// });

// module.exports = mongoose.model('RideOffer', rideOfferSchema);



// const mongoose = require('mongoose');

// module.exports = mongoose.model('RideOffer',
//     {
//         departure: String,
//         destination: String,
//         date: String, seats: String,
//         phoneNumber: Number,
//         carName: String,
//         // Fields for geospatial coordinates
//         departureCoordinates: {
//             type: {
//               type: String,
//               enum: ['Point'],
//               required: true,
//             },
//             coordinates: {
//               type: [Number],
//               required: true,
//             },
//           },
//           destinationCoordinates: {
//             type: {
//               type: String,
//               enum: ['Point'],
//               required: true,
//             },
//             coordinates: {
//               type: [Number],
//               required: true,
//             },
//           }
//  });
const RideOfferModel = require('../models/rideOffer');

module.exports.rideOffer = async (req, res) => {
  const {
    departure,
    destination,
    date,
    seats,
    rs,
    phoneNumber,
    carName,
    departureCoordinates,
    destinationCoordinates,
    userId, // Retrieve the user ID from the request body
  } = req.body;

  try {
    // Check if all required fields, including userId, are provided
    if (
      !departure ||
      !destination ||
      !date ||
      !seats ||
      !rs ||
      !phoneNumber ||
      !carName ||
      !departureCoordinates ||
      !destinationCoordinates ||
      !userId
    ) {
      return res.status(400).json({ error: 'Please fill in all fields including coordinates and user ID' });
    }

    // Create a new ride offer
    const newRide = new RideOfferModel({
      departure,
      destination,
      date,
      seats,
      rs,
      bookedUsers:[],
      phoneNumber,
      carName,
      departureCoordinates,
      destinationCoordinates,
      userId, // Save the user ID in the database
    });
    await newRide.save();

    res.status(201).json({ message: 'Ride created successfully' });
  } catch (error) {
    console.error('Error creating ride:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

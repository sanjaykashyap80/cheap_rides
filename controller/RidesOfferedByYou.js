const express = require('express');
const RideOfferModel = require('../models/rideOffer');

module.exports.ridesOfferedByYou = async (req, res) => {
  const userId = req.params.userId; // Get the user ID from the request parameters

  try {
    // Find rides offered by the user using the userId
    const ridesOfferedByUser = await RideOfferModel.find({ userId });

    res.status(200).json(ridesOfferedByUser);
  } catch (error) {
    console.error('Error fetching rides offered by the user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Route to cancel a ride
module.exports.cancelRide = async (req, res) => {
  const rideId = req.params.rideId; // Get the ride ID from the request parameters
  const userId = req.params.userId; // Get the user ID from the request parameters

  try {
    // Find the ride to be canceled using the rideId and userId (for additional security)
    const rideToCancel = await RideOfferModel.findOne({ _id: rideId, userId });

    if (!rideToCancel) {
      return res.status(404).json({ error: 'Ride not found or unauthorized to cancel' });
    }

    // Remove the ride from the database
    await RideOfferModel.findByIdAndDelete(rideId);

    res.status(200).json({ message: 'Ride canceled successfully' });
  } catch (error) {
    console.error('Error canceling ride:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a ride
module.exports.updateRide = async (req, res) => {
  const rideId = req.params.rideId; // Get the ride ID from the request parameters

  try {
    // Find the ride to be updated using the rideId
    const rideToUpdate = await RideOfferModel.findById(rideId);

    if (!rideToUpdate) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Update ride details with the new data
    rideToUpdate.departure = req.body.departure;
    rideToUpdate.destination = req.body.destination;
    rideToUpdate.date = req.body.date;
    rideToUpdate.seats = req.body.seats;
    rideToUpdate.carName = req.body.carName;

    // Save the updated ride
    await rideToUpdate.save();

    res.status(200).json({ message: 'Ride updated successfully' });
  } catch (error) {
    console.error('Error updating ride:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

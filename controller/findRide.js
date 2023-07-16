const FindRideModel = require('../models/rideOffer')
const mongoose = require('mongoose');

module.exports.findride = async (req, res) => {
    const { departure, destination, date, seats } = req.query;
    console.log("req.query:", req.query);
    try {
        // Prepare the filter object based on the provided criteria
        const filter = {};
        if (destination) {
            filter.destination = destination;
        }
        if (departure) {
            filter.departure = departure;
        }
        if (date) {
            filter.date = date;
        }
        if (seats) {
            filter.seatsAvailable = parseInt(seats);
        }

        // Fetch the filtered data from the database
        const data = await FindRideModel.find(filter);

        console.log("data:", data)
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Define the route to book a ride
module.exports.bookride = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    // const usId = mongoose.Types.ObjectId(userId)

    try {
        // Find the ride by its ID
        const ride = await FindRideModel.findById(id);

        if (!ride) {
            return res.status(404).json({ error: 'Ride not found' });
        }

        // Check if there are available seats
        if (ride.seats === 0) {
            return res.status(400).json({ error: 'No seats available' });
        }

        ride.seats--;
        await ride.save();

        // Create a new booked ride entry in the database
        const bookedRide = new FindRideModel({
            rideId: ride._id,
            userId: userId, // Add the user ID to the booked ride entry
            departure: ride.departure,
            destination: ride.destination,
            date: ride.date,
            seats: ride.seats,
            carName: "Brezza",
        });
        
        bookedRide.save((error, savedRide) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ error: 'Failed to save booked ride' });
            }
            console.log("Saved bookedRide:", savedRide);
            res.json({ message: `Backend: Ride with ID ${id} booked successfully` });
          });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




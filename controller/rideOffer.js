const RideOfferModel = require('../models/rideOffer')

module.exports.rideOffer =  async (req, res) => {
    const { departure, destination, date, seats, phoneNumber, carName } = req.body;
    
    try {
        // Create a new user
        const newRide = new RideOfferModel({ departure, destination, date, seats, phoneNumber, carName });
        await newRide.save();
        
        res.status(201).json({ message: 'Ride created successfully' });
    } catch (error) {
        console.error('Error creatind ride:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// module.exports.rideOffer = (req, res) => {
//     console.log(req.body)

//     // email should not exist alreday

//     const newRide = new RideOfferModel({
//         departure: req.body.departure,
//         destination: req.body.destination,
//         date: req.body.date,
//         seats: req.body.seats,
//         carName: req.body.carName
//     });

//     newRide.save().then(() => {
//         res.send({ code: 200, message: 'Ride success' })
//     }).catch((err) => {
//         res.send({ code: 500, message: 'Ride Err',err })
//     })

// }
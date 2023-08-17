const FindRideModel = require('../models/rideOffer');
const mongoose = require('mongoose');
const { Client } = require('@googlemaps/google-maps-services-js');

// Function to get geocode (latitude and longitude) for an address using Google Maps API
async function getGeocode(address) {
  const client = new Client({});

  try {
    const response = await client.geocode({
      params: {
        address,
        key: 'AIzaSyBknVPmWxcoRV_HPAQRuI1HlX_50_DBFy8', // Replace with your actual API key
      },
    });

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error('Geocode not found for the address');
    }
  } catch (error) {
    throw new Error('Failed to get geocode for the address');
  }
}


module.exports.findride = async (req, res) => {
  const { departure, destination, date, seats } = req.query;

  try {
    let data = [];

    if (destination && departure) {
      // Get geocode for departure and destination addresses
      const destinationGeocode = await getGeocode(destination);
      const departureGeocode = await getGeocode(departure);

      // Query for rides within radius of departure
      const departureData = await FindRideModel.find({
        departureCoordinates: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [departureGeocode.longitude, departureGeocode.latitude],
            },
            $maxDistance: 10000, // Replace with your desired radius in meters
          },
        },
      });

      // Filter rides within radius of destination
      data = departureData.filter(ride =>
        ride.destinationCoordinates.coordinates[0] <= destinationGeocode.longitude + 0.01 &&
        ride.destinationCoordinates.coordinates[0] >= destinationGeocode.longitude - 0.01 &&
        ride.destinationCoordinates.coordinates[1] <= destinationGeocode.latitude + 0.01 &&
        ride.destinationCoordinates.coordinates[1] >= destinationGeocode.latitude - 0.01
      );
    } else {
      // ... Your existing code for filtering by individual points
      if (destination) {
        filter.destinationCoordinates = await getGeocode(destination);
      }
      if (departure) {
        filter.departureCoordinates = await getGeocode(departure);
      }
      if (date) {
        filter.date = date;
      }
      if (seats) {
        filter.seatsAvailable = parseInt(seats);
      }

      // Fetch the filtered data from the database
      data = await FindRideModel.find(filter);
      console.log("filtered data", data);
    }

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

  try {
    // Find the ride by its ID
    const ride = await FindRideModel.findById(id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Check if there are available seats
    if (ride.seats <= 0) {
      return res.status(400).json({ error: 'No seats available' });
    }
    else{
      ride.seats--;
    }

    // Decrement the seats count
    // ride.seats--;

    // Add the user to the bookedUsers array
    ride.bookedUsers = ride.bookedUsers ? [...ride.bookedUsers, userId] : [userId];

    // Update the ride document
    await ride.save();

    res.json({ message: `Backend: Ride with ID ${id} booked successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add this route to your app.js or appropriate route file
// app.get('/booked/user/:userId', async (req, res) => {
module.exports.bookedByYou =  async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the booked rides for the given user ID
    const bookedRides = await FindRideModel.find({ bookedUsers: userId });

    res.json(bookedRides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Add this route to your app.js or appropriate route file
// app.delete('/cancel-ride/:rideId', async (req, res) => {
 // Example of bookedRideCancel function
module.exports.bookedRideCancel = async (req, res) => {
  const { rideId, userId } = req.params;

  try {
    // Find the ride by its ID and update the bookedUsers array to remove the current user's ID
    const ride = await FindRideModel.findById(rideId);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    // Remove the current user's ID from the bookedUsers array
    ride.bookedUsers = ride.bookedUsers.filter(userId => {
      console.log(userId)
        return userId.toString() !== userId.toString()});
    
        ride.seats++
    // Save the updated ride
    await ride.save();

    res.json({ message: 'Ride canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




//----------------------------------------
// // Define the route to book a ride
// module.exports.bookride = async (req, res) => {
//   const { id } = req.params;
//   const { userId } = req.body;

//   try {
//     // Find the ride by its ID
//     const ride = await FindRideModel.findById(id);

//     if (!ride) {
//       return res.status(404).json({ error: 'Ride not found' });
//     }

//     // Check if there are available seats
//     if (ride.seats === 0) {
//       return res.status(400).json({ error: 'No seats available' });
//     }
     
//     // Update the ride by decrementing seats and adding the user to the bookedUsers array
//     // ride.seats--;
//     // // ride.bookedUsers.push(userId); // Assuming 'bookedUsers' is the field to store user IDs
//     // ride.bookedUsers = ride.bookedUsers && [...ride.bookedUsers, userId] || [userId]
//     console.log("ride:-",ride)
//     await FindRideModel.updateOne({_id:ride._id},{seats:ride.seats--,bookedUsers:ride.bookedUsers && [...ride.bookedUsers, userId] || [userId]});

//     res.json({ message: `Backend: Ride with ID ${id} booked successfully` });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
// -------------------------------------



// const FindRideModel = require('../models/rideOffer');
// const mongoose = require('mongoose');
// const { Client } = require('@googlemaps/google-maps-services-js');

// // Function to get geocode (latitude and longitude) for an address using Google Maps API
// async function getGeocode(address) {
//   const client = new Client({});

//   try {
//     const response = await client.geocode({
//       params: {
//         address,
//         key: 'AIzaSyBknVPmWxcoRV_HPAQRuI1HlX_50_DBFy8', // Replace with your actual API key
//       },
//     });

//     if (response.data.results.length > 0) {
//       const { lat, lng } = response.data.results[0].geometry.location;
//       return { latitude: lat, longitude: lng };
//     } else {
//       throw new Error('Geocode not found for the address');
//     }
//   } catch (error) {
//     throw new Error('Failed to get geocode for the address');
//   }
// }


// module.exports.findride = async (req, res) => {
//   const { departure, destination, date, seats } = req.query;

//   try {
//     let data = [];

//     if (destination && departure) {
//       // Get geocode for departure and destination addresses
//       const destinationGeocode = await getGeocode(destination);
//       const departureGeocode = await getGeocode(departure);

//       // Query for rides within radius of departure
//       const departureData = await FindRideModel.find({
//         departureCoordinates: {
//           $nearSphere: {
//             $geometry: {
//               type: 'Point',
//               coordinates: [departureGeocode.longitude, departureGeocode.latitude],
//             },
//             $maxDistance: 10000, // Replace with your desired radius in meters
//           },
//         },
//       });

//       // Filter rides within radius of destination
//       data = departureData.filter(ride =>
//         ride.destinationCoordinates.coordinates[0] <= destinationGeocode.longitude + 0.01 &&
//         ride.destinationCoordinates.coordinates[0] >= destinationGeocode.longitude - 0.01 &&
//         ride.destinationCoordinates.coordinates[1] <= destinationGeocode.latitude + 0.01 &&
//         ride.destinationCoordinates.coordinates[1] >= destinationGeocode.latitude - 0.01
//       );
//     } else {
//       // ... Your existing code for filtering by individual points
//       if (destination) {
//         filter.destinationCoordinates = await getGeocode(destination);
//       }
//       if (departure) {
//         filter.departureCoordinates = await getGeocode(departure);
//       }
//       if (date) {
//         filter.date = date;
//       }
//       if (seats) {
//         filter.seatsAvailable = parseInt(seats);
//       }

//       // Fetch the filtered data from the database
//       data = await FindRideModel.find(filter);
//       console.log("filtered data", data);
//     }

//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };




// // Define the route to book a ride
// module.exports.bookride = async (req, res) => {
//   const { id } = req.params;
//   const { userId } = req.body;
//   console.log("Received userId:", userId);
//     // const usId = mongoose.Types.ObjectId(userId)

//     try {
//         // Find the ride by its ID
//         const ride = await FindRideModel.findById(id);

//         if (!ride) {
//             return res.status(404).json({ error: 'Ride not found' });
//         }

//         // Check if there are available seats
//         if (ride.seats === 0) {
//             return res.status(400).json({ error: 'No seats available' });
//         }

//         ride.seats--;
//         await ride.save();

//         // Create a new booked ride entry in the database
//         const bookedRide = new FindRideModel({
//             rideId: ride._id,
//             userId: userId, // Add the user ID to the booked ride entry
//             departure: ride.departure,
//             destination: ride.destination,
//             date: ride.date,
//             seats: ride.seats,
//             carName: ride.carName,
//         });

//         bookedRide.save((error, savedRide) => {
//             if (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Failed to save booked ride' });
//             }
//             console.log("Saved bookedRide:", savedRide);
//             res.json({ message: `Backend: Ride with ID ${id} booked successfully` });
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };




// const FindRideModel = require('../models/rideOffer');
// const mongoose = require('mongoose');
// const { Client } = require('@googlemaps/google-maps-services-js');

// // Function to get geocode (latitude and longitude) for an address using Google Maps API
// async function getGeocode(address) {
//   const client = new Client({});

//   try {
//     const response = await client.geocode({
//       params: {
//         address,
//         key: 'AIzaSyBknVPmWxcoRV_HPAQRuI1HlX_50_DBFy8', // Replace with your actual API key
//       },
//     });

//     if (response.data.results.length > 0) {
//       const { lat, lng } = response.data.results[0].geometry.location;
//       return { latitude: lat, longitude: lng };
//     } else {
//       throw new Error('Geocode not found for the address');
//     }
//   } catch (error) {
//     throw new Error('Failed to get geocode for the address');
//   }
// }


// module.exports.findride = async (req, res) => {
//   const { departure, destination, date, seats } = req.query;

//   try {
//     let data = [];

//     if (destination && departure) {
//       // Get geocode for departure and destination addresses
//       const destinationGeocode = await getGeocode(destination);
//       const departureGeocode = await getGeocode(departure);

//       // Query for rides within radius of departure
//       const departureData = await FindRideModel.find({
//         departureCoordinates: {
//           $nearSphere: {
//             $geometry: {
//               type: 'Point',
//               coordinates: [departureGeocode.longitude, departureGeocode.latitude],
//             },
//             $maxDistance: 10000, // Replace with your desired radius in meters
//           },
//         },
//       });

//       // Query for rides within radius of destination
//       const destinationData = await FindRideModel.find({
//         destinationCoordinates: {
//           $nearSphere: {
//             $geometry: {
//               type: 'Point',
//               coordinates: [destinationGeocode.longitude, destinationGeocode.latitude],
//             },
//             $maxDistance: 10000, // Replace with your desired radius in meters
//           },
//         },
//       });

//       // Combine the results from both queries
//       data = [...departureData, ...destinationData];

//     } else {
//       // ... Your existing code for filtering by individual points
//       if (destination) {
//         filter.destinationCoordinates = await getGeocode(destination);
//       }
//       if (departure) {
//         filter.departureCoordinates = await getGeocode(departure);
//       }
//       if (date) {
//         filter.date = date;
//       }
//       if (seats) {
//         filter.seatsAvailable = parseInt(seats);
//       }

//       // Fetch the filtered data from the database
//       const data = await FindRideModel.find(filter);
//       console.log("filterd data",data)
//     }

//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };




// // Define the route to book a ride
// module.exports.bookride = async (req, res) => {
//   const { id } = req.params;
//   const { userId } = req.body;
//   console.log("Received userId:", userId);
//     // const usId = mongoose.Types.ObjectId(userId)

//     try {
//         // Find the ride by its ID
//         const ride = await FindRideModel.findById(id);

//         if (!ride) {
//             return res.status(404).json({ error: 'Ride not found' });
//         }

//         // Check if there are available seats
//         if (ride.seats === 0) {
//             return res.status(400).json({ error: 'No seats available' });
//         }

//         ride.seats--;
//         await ride.save();

//         // Create a new booked ride entry in the database
//         const bookedRide = new FindRideModel({
//             rideId: ride._id,
//             userId: userId, // Add the user ID to the booked ride entry
//             departure: ride.departure,
//             destination: ride.destination,
//             date: ride.date,
//             seats: ride.seats,
//             carName: ride.carName,
//         });

//         bookedRide.save((error, savedRide) => {
//             if (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Failed to save booked ride' });
//             }
//             console.log("Saved bookedRide:", savedRide);
//             res.json({ message: `Backend: Ride with ID ${id} booked successfully` });
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


// const FindRideModel = require('../models/rideOffer');
// const mongoose = require('mongoose');
// const { Client } = require('@googlemaps/google-maps-services-js');

// // Function to get geocode (latitude and longitude) for an address using Google Maps API
// async function getGeocode(address) {
//   const client = new Client({});

//   try {
//     const response = await client.geocode({
//       params: {
//         address,
//         key: 'AIzaSyBknVPmWxcoRV_HPAQRuI1HlX_50_DBFy8', // Replace with your actual API key
//       },
//     });

//     if (response.data.results.length > 0) {
//       const { lat, lng } = response.data.results[0].geometry.location;
//       return { latitude: lat, longitude: lng };
//     } else {
//       throw new Error('Geocode not found for the address');
//     }
//   } catch (error) {
//     throw new Error('Failed to get geocode for the address');
//   }
// }

// module.exports.findride = async (req, res) => {
//   const { departure, destination, date, seats } = req.query;
//   console.log("req.query:-", req.query);
  
//   try {
//     // Prepare the filter object based on the provided criteria
//     const filter = {};

//     if (destination && departure) {
//       // Get geocode (latitude and longitude) for the provided destination and departure addresses
//       const destinationGeocode = await getGeocode(destination);
//       const departureGeocode = await getGeocode(departure);
//       console.log("destinationGeocode:-",destinationGeocode,"departureGeocode:-",departureGeocode)
//       console.log("destinationGeocode.longitude:-",destinationGeocode.longitude);

//       // Perform separate MongoDB queries for destination and departure coordinates
//       const destinationFilter = {
//         destinationCoordinates: {
//           $near: {
//             $geometry: {
//               type: 'Point',
//               coordinates: [destinationGeocode.longitude, destinationGeocode.latitude],
//             },
//             $maxDistance: 10000, // Replace with your desired radius in meters
//           },
//         },
//       };

//       const departureFilter = {
//         departureCoordinates: {
//           $near: {
//             $geometry: {
//               type: 'Point',
//               coordinates: [departureGeocode.longitude, departureGeocode.latitude],
//             },
//             $maxDistance: 10000, // Replace with your desired radius in meters
//           },
//         },
//       };
//       console.log("destinationFilter:-",destinationFilter,"departureFilter:-",departureFilter)
//       // Fetch the filtered data from the database for both destination and departure
//       const destinationData = await FindRideModel.find(destinationFilter);
//       const departureData = await FindRideModel.find(departureFilter);

//       // Combine the results from both queries
//       const data = [...destinationData, ...departureData];
//       console.log("72 data:-",data)
      
//       res.json(data);
//     } else {
//       // Perform the query without geospatial filtering if either destination or departure is not provided
//       if (destination) {
//         filter.destinationCoordinates = await getGeocode(destination);
//       }
//       if (departure) {
//         filter.departureCoordinates = await getGeocode(departure);
//       }
//       if (date) {
//         filter.date = date;
//       }
//       if (seats) {
//         filter.seatsAvailable = parseInt(seats);
//       }

//       // Fetch the filtered data from the database
//       const data = await FindRideModel.find(filter);
//       console.log("filterd data",data)

//       res.json(data);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


// // Define the route to book a ride
// module.exports.bookride = async (req, res) => {
//   const { id } = req.params;
//   const { userId } = req.body;
//   console.log("Received userId:", userId);
//     // const usId = mongoose.Types.ObjectId(userId)

//     try {
//         // Find the ride by its ID
//         const ride = await FindRideModel.findById(id);

//         if (!ride) {
//             return res.status(404).json({ error: 'Ride not found' });
//         }

//         // Check if there are available seats
//         if (ride.seats === 0) {
//             return res.status(400).json({ error: 'No seats available' });
//         }

//         ride.seats--;
//         await ride.save();

//         // Create a new booked ride entry in the database
//         const bookedRide = new FindRideModel({
//             rideId: ride._id,
//             userId: userId, // Add the user ID to the booked ride entry
//             departure: ride.departure,
//             destination: ride.destination,
//             date: ride.date,
//             seats: ride.seats,
//             carName: "Brezza",
//         });

//         bookedRide.save((error, savedRide) => {
//             if (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Failed to save booked ride' });
//             }
//             console.log("Saved bookedRide:", savedRide);
//             res.json({ message: `Backend: Ride with ID ${id} booked successfully` });
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };



// ---------working code-------------
// const FindRideModel = require('../models/rideOffer')
// const mongoose = require('mongoose');

// module.exports.findride = async (req, res) => {
//     const { departure, destination, date, seats } = req.query;
//     console.log("req.query:", req.query);
//     try {
//         // Prepare the filter object based on the provided criteria
//         const filter = {};
//         if (destination) {
//             filter.destination = destination;
//         }
//         if (departure) {
//             filter.departure = departure;
//         }
//         if (date) {
//             filter.date = date;
//         }
//         if (seats) {
//             filter.seatsAvailable = parseInt(seats);
//         }

//         // Fetch the filtered data from the database
//         const data = await FindRideModel.find(filter);

//         console.log("data:", data)
//         res.json(data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Define the route to book a ride
// module.exports.bookride = async (req, res) => {
//     const { id } = req.params;
//     const { userId } = req.body;
//     // const usId = mongoose.Types.ObjectId(userId)

//     try {
//         // Find the ride by its ID
//         const ride = await FindRideModel.findById(id);

//         if (!ride) {
//             return res.status(404).json({ error: 'Ride not found' });
//         }

//         // Check if there are available seats
//         if (ride.seats === 0) {
//             return res.status(400).json({ error: 'No seats available' });
//         }

//         ride.seats--;
//         await ride.save();

//         // Create a new booked ride entry in the database
//         const bookedRide = new FindRideModel({
//             rideId: ride._id,
//             userId: userId, // Add the user ID to the booked ride entry
//             departure: ride.departure,
//             destination: ride.destination,
//             date: ride.date,
//             seats: ride.seats,
//             carName: "Brezza",
//         });

//         bookedRide.save((error, savedRide) => {
//             if (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Failed to save booked ride' });
//             }
//             console.log("Saved bookedRide:", savedRide);
//             res.json({ message: `Backend: Ride with ID ${id} booked successfully` });
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };




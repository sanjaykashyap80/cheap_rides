const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors')
const userController = require('./controller/user')
const rideOfferController = require('./controller/rideOffer')
const rideFindController = require('./controller/findRide')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// const winston = require('winston');

// const logger = winston.createLogger({
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: 'server.log' }),
//   ],
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.printf((info) => {
//       return `${info.timestamp} ${info.level}: ${info.message}`;
//     })
//   ),
// });


mongoose.connect('mongodb+srv://sanjaykashyap80770:Sj7ZhRwUMuL2KatZ@cluster0.fhzzeaw.mongodb.net/?retryWrites=true&w=majority', (err) => {
    if (err) {
        console.log('DB Err.', err)
    } else {
        console.log('DB Connected.')
    }
}); 
// const { MongoClient } = require('mongodb');

// // MongoDB Atlas connection URI
// const uri = 'mongodb+srv://sanjaykashyap80770:Sj7ZhRwUMuL2KatZ@cluster0.fhzzeaw.mongodb.net/?retryWrites=true&w=majority';

// // Create a new MongoClient
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// // Connect to the MongoDB Atlas cluster
// async function connectToMongoDB() {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB Atlas');

//     // Perform database operations
//     // ...
//   } catch (error) {
//     console.error('Failed to connect to MongoDB Atlas', error);
//   }
// }

// // Call the connectToMongoDB function to establish the connection
// connectToMongoDB();


app.post('/signup', userController.signup)
app.post('/signin', userController.signin)
// app.post('/submit-otp', userController.submitotp)
// app.post('/send-otp', userController.sendotp)
app.post('/offers', rideOfferController.rideOffer)
app.get('/offers', rideFindController.findride)
app.post('/booked/:id/book', rideFindController.bookride)

// app.listen(5000, () => {
//     console.log(`Backend Running At Port 5000`)
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  module.exports = app;
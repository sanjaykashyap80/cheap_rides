const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const userController = require('./controller/user');
const rideOfferController = require('./controller/rideOffer');
const rideFindController = require('./controller/findRide');
const ridesOfferedByUserController = require('./controller/RidesOfferedByYou');

const app = express();
app.set('view engine', 'ejs');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://sanjaykashyap80770:Sj7ZhRwUMuL2KatZ@cluster0.fhzzeaw.mongodb.net/?retryWrites=true&w=majority', (err) => {
    if (err) {
        console.log('DB Err.', err);
    } else {
        console.log('DB Connected.');
    }
});

app.post('/signup', userController.signup);
app.post('/signin', userController.signin);
app.post('/reset-password', userController.resetPassword);
app.post('/reset-password/:token', userController.handlePasswordReset);
app.post('/offers', rideOfferController.rideOffer);
app.get('/offers', rideFindController.findride);
app.post('/booked/:id/book', rideFindController.bookride);
app.get('/booked/user/:userId', rideFindController.bookedByYou);
app.delete('/cancel-ride/:rideId/:userId', rideFindController.bookedRideCancel);
app.get('/offers/user/:userId', ridesOfferedByUserController.ridesOfferedByYou);
// app.delete('/offers/:rideId', ridesOfferedByUserController.cancelRide);
app.delete('/offers/:userId/:rideId', ridesOfferedByUserController.cancelRide);
// Update a ride
app.put('/offers/:rideId', ridesOfferedByUserController.updateRide);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Middleware for handling errors
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Check if the error has a status code, otherwise set it to 500 (Internal Server Error)
    const statusCode = err.statusCode || 500;

    // Send a JSON response with the error message
    res.status(statusCode).json({ error: err.message });
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;



// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const userController = require('./controller/user');
// const rideOfferController = require('./controller/rideOffer');
// const rideFindController = require('./controller/findRide');
// const ridesOfferedByUserController = require('./controller/RidesOfferedByYou');

// const app = express();
// app.set('view engine', 'ejs');

// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// mongoose.connect('mongodb+srv://sanjaykashyap80770:Sj7ZhRwUMuL2KatZ@cluster0.fhzzeaw.mongodb.net/?retryWrites=true&w=majority', (err) => {
//   if (err) {
//     console.log('DB Err.', err);
//   } else {
//     console.log('DB Connected.');
//   }
// });

// app.post('/signup', userController.signup);
// app.post('/signin', userController.signin);
// app.post('/offers', rideOfferController.rideOffer);
// app.get('/offers', rideFindController.findride);
// app.post('/booked/:id/book', rideFindController.bookride);
// app.get('/offers/user/:userId', ridesOfferedByUserController.ridesOfferedByYou);
// app.delete('/offers/:userId/:rideId', ridesOfferedByUserController.cancelRide); // Add route for canceling ride

// // Middleware for handling errors
// app.use((err, req, res, next) => {
//   console.error(err.stack);

//   // Check if the error has a status code, otherwise set it to 500 (Internal Server Error)
//   const statusCode = err.statusCode || 500;

//   // Send a JSON response with the error message
//   res.status(statusCode).json({ error: err.message });
// });

// // Catch 404 and forward to error handler
// app.use((req, res, next) => {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// module.exports = app;





// const express = require('express')
// const bodyParser = require('body-parser')
// const mongoose = require('mongoose');
// const cors = require('cors')
// const userController = require('./controller/user')
// const rideOfferController = require('./controller/rideOffer')
// const rideFindController = require('./controller/findRide')
// const ridesOfferedByUserController = require('./controller/RidesOfferedByYou')

// const app = express()
// app.set('view engine', 'ejs');

// app.use(cors())
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

// mongoose.connect('mongodb+srv://sanjaykashyap80770:Sj7ZhRwUMuL2KatZ@cluster0.fhzzeaw.mongodb.net/?retryWrites=true&w=majority', (err) => {
//     if (err) {
//         console.log('DB Err.', err)
//     } else {
//         console.log('DB Connected.')
//     }
// });

// app.post('/signup', userController.signup)
// app.post('/signin', userController.signin)
// // app.post('/submit-otp', userController.submitotp)
// // app.post('/send-otp', userController.sendotp)
// app.post('/offers', rideOfferController.rideOffer)
// app.get('/offers', rideFindController.findride)
// app.post('/booked/:id/book', rideFindController.bookride)
// app.get('/offers/user/:userId', ridesOfferedByUserController.ridesOfferedByYou);
// app.delete('/offers/:rideId', ridesOfferedByUserController.cancelRide);

// // app.listen(5000, () => {
// //     console.log(`Backend Running At Port 5000`)
// // })

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });

// // Middleware for handling errors
// app.use((err, req, res, next) => {
//     console.error(err.stack);
  
//     // Check if the error has a status code, otherwise set it to 500 (Internal Server Error)
//     const statusCode = err.statusCode || 500;
  
//     // Send a JSON response with the error message
//     res.status(statusCode).json({ error: err.message });
//   });

// // error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

// module.exports = app;
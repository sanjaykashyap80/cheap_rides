const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors')
const userController = require('./controller/user')
const rideOfferController = require('./controller/rideOffer')
const rideFindController = require('./controller/findRide')

const app = express()
app.set('view engine', 'ejs');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect('mongodb+srv://sanjaykashyap80770:Sj7ZhRwUMuL2KatZ@cluster0.fhzzeaw.mongodb.net/?retryWrites=true&w=majority', (err) => {
    if (err) {
        console.log('DB Err.', err)
    } else {
        console.log('DB Connected.')
    }
});

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
app.use(function (req, res, next) {
    next(createError(404));
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
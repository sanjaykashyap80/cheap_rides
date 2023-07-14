const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//   });

// module.exports = mongoose.model('User',UserSchema);

module.exports = mongoose.model('User',
 { email: String, password: String, fullName: String, phoneNumber: Number, otp: Number });
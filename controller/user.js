const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user')

// Sign up route
module.exports.signup =  async (req, res) => {
    const { email, password, fullName, phoneNumber } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({ email, password: hashedPassword, fullName, phoneNumber });
      await newUser.save();
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error signing up:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  // Login route
  module.exports.signin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
  
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
  
      // Create and sign a JWT token
      const token = jwt.sign({ email: user.email }, 'fdesgfv');
      const id = user._id
      const fullName = user.fullName
      const phoneNumber = user.phoneNumber
  
      res.status(200).json({ token, id, fullName, phoneNumber });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  // const UserModel = require('../models/user')
// const nodemailer = require('nodemailer')


// module.exports.signup = (req, res) => {
//     console.log(req.body,req,res)

//     // email should not exist alreday

//     const newUser = new UserModel({
//         id:"1",
//         name:req.body.name,
//         email: req.body.email,
//         password: req.body.password
//     });

//     newUser.save().then(() => {
//         res.send({ code: 200, message: 'Signup success' })
//     }).catch((err) => {
//         res.send({ code: 500, message: 'Signup Err',err })
//     })

// }

// module.exports.signin = (req, res) => {
//     console.log(req.body.email)

//     // email and password match

//     UserModel.findOne({ email: req.body.email })
//         .then(result => {
//             console.log(result, '11')

//             // match password with req.body.password
//             if (result.password !== req.body.password) {
//                 res.send({ code: 404, message: 'password wrong' })
//             } else {
//                 res.send({
//                     email: result.email,
//                     code: 200,
//                     message: 'user Found',
//                     // token: 'hfgdhe'
//                 })
//             }

//         })
//         .catch(err => {
//             res.send({ code: 500, message: 'user not found' })
//         })


//     // newUser.save().then(() => {
//     //     res.send({ code: 200, message: 'Signup success' })
//     // }).catch((err) => {
//     //     res.send({ code: 500, message: 'Signup Err' })
//     // })

// }

// module.exports.sendotp = async (req, res) => {
//     console.log(req.body)
//     const _otp = Math.floor(100000 + Math.random() * 900000)
//     console.log(_otp)
//     let user = await UserModel.findOne({ email: req.body.email })
//     // send to user mail
//     if (!user) {
//         res.send({ code: 500, message: 'user not found' })
//     }

//     let testAccount = await nodemailer.createTestAccount()

//     let transporter = nodemailer.createTransport({
//         host: "smtp.ethereal.email",
//         port: 587,
//         secure: false,
//         auth: {
//             user: testAccount.user,
//             pass: testAccount.pass
//         }
//     })



//     let info = await transporter.sendMail({
//         from: 'naimuddin540@gmail.com',
//         to: req.body.email, // list of receivers
//         subject: "OTP", // Subject line
//         text: String(_otp),
//         html: `<html>
//             < body >
//             Hello and welcome
//         </ >
//        </html > `,
//     })

//     if (info.messageId) {

//         console.log(info, 84)
//         UserModel.updateOne({ email: req.body.email }, { otp: _otp })
//             .then(result => {
//                 res.send({ code: 200, message: 'otp send' })
//             })
//             .catch(err => {
//                 res.send({ code: 500, message: 'Server err' })

//             })

//     } else {
//         res.send({ code: 500, message: 'Server err' })
//     }
// }


// module.exports.submitotp = (req, res) => {
//     console.log(req.body)


//     UserModel.findOne({ otp: req.body.otp }).then(result => {

//         //  update the password 

//         UserModel.updateOne({ email: result.email }, { password: req.body.password })
//             .then(result => {
//                 res.send({ code: 200, message: 'Password updated' })
//             })
//             .catch(err => {
//                 res.send({ code: 500, message: 'Server err' })

//             })


//     }).catch(err => {
//         res.send({ code: 500, message: 'otp is wrong' })

//     })


// }
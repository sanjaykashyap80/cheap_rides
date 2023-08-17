const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user')

module.exports.signup = async (req, res) => {
    const { email, password, fullName, phoneNumber } = req.body;

    try {
        if (!fullName || !email || !password || !phoneNumber) {
            return res.status(400).json({ error: 'Please fill in all fields' });
        }

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

module.exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide both email and password' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create and sign a JWT token
        const token = jwt.sign({ email: user.email }, 'fdesgfv');
        const id = user._id;
        const fullName = user.fullName;
        const phoneNumber = user.phoneNumber;

        res.status(200).json({ token, id, fullName, phoneNumber });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.resetPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate a reset token (you can use libraries like `crypto` or `jsonwebtoken`)
      const resetToken = generateResetToken(); // Implement this function
  
      // Save the token in the user document
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();
  
      // Send an email with the reset link containing the resetToken
      sendResetEmail(user.email, resetToken); // Implement this function
  
      res.json({ message: 'Password reset link sent to your email' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };  

  module.exports.handlePasswordReset = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      const user = await UserModel.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      // Set the new password
      user.password = await bcrypt.hash(newPassword, saltRounds);
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();
  
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  


// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user')

// module.exports.signup = async (req, res) => {
//     const { email, password, fullName, phoneNumber } = req.body;

//     try {
//         if (!fullName || !email || !password || !phoneNumber) {
//             return res.status(400).json({ error: 'Please fill in all fields' });
//         }

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(409).json({ error: 'User already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const newUser = new User({ email, password: hashedPassword, fullName, phoneNumber });
//         await newUser.save();

//         res.status(201).json({ message: 'User created successfully' });
//     } catch (error) {
//         console.error('Error signing up:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// module.exports.signin = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         if (!email || !password) {
//             return res.status(400).json({ error: 'Please provide both email and password' });
//         }

//         // Find the user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         // Compare the provided password with the stored hashed password
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         // Create and sign a JWT token
//         const token = jwt.sign({ email: user.email }, 'fdesgfv');
//         const id = user._id;
//         const fullName = user.fullName;
//         const phoneNumber = user.phoneNumber;

//         res.status(200).json({ token, id, fullName, phoneNumber });
//     } catch (error) {
//         console.error('Error logging in:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };



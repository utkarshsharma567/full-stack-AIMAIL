const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
  try {
    // 1️⃣ Header se token nikaalo
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // 2️⃣ Agar token nahi mila → access deny
    if (!token) {
      return res.status(401).json({
        message:  'Not authorized, no token'
      });
    }

    // 3️⃣ Token ko verify karo (ye check karega valid hai ya nahi)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Token se user ki id nikaal ke DB me user dhundo
    const user = await User.findById(decoded.id)

    // 5️⃣ Agar user nahi mila
    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    // 6️⃣ User ko request me add karo (taaki aage use ho sake)
    req.user = user;

    // 7️⃣ Sab sahi hai → next function call karo
    next();

  } catch (error) {
    // Agar token galat hai ya expire ho gaya
    return res.status(401).json({
      message: 'Invalid ya expired token',
      error: error.message
    });
  }
};
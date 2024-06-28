const jwt = require("jsonwebtoken");
const { GetDataById } = require('../models/commonmodel');

const auth = async (req, res, next) => {
  try {
    // Extract Authorization header from request
    const bearerHeader = req.headers["authorization"];

    // Check if Authorization header is present
    if (typeof bearerHeader !== 'undefined') {
      // Split the header value to get the token part
      const bearer = bearerHeader.split(" ");
      // Set token in request object
      req.token = bearer[1];
      
      const verifyUser = jwt.verify(req.token, 'your-secret-key');
      
      const user = await GetDataById('users', { id: verifyUser.userId });

      // Check if user exists
      if (user.length > 0) {
        // If user exists, set authenticated userId in request object
        req.authUser = verifyUser.userId;
        next();
      } else {
        // If user not found, return 401 Unauthorized
        return res.status(401).json({
          success: false,
          status: 401,
          message: "User not found",
        });
      }
    } else {
      // If Authorization header is not provided, return 400 Bad Request
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Token Not Provided",
      });
    }
  } catch (err) {
    // Handle JWT verification errors
    console.log(err);
    return res.status(401).json({
      success: false,
      status: 401,
      message: "Access forbidden",
    });
  }
};

module.exports = auth;

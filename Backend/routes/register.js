const express = require("express");
const RegisterController = require("../controllers/RegisterController");

const router = express.Router(); // Create a new router

// Endpoint to sign up a new user
router.post("/signup", RegisterController.signUp);

// Endpoint to log in a user
router.post("/login", RegisterController.login);

// Endpoint to verify a user with a token
router.get("/verifiedUser/:token", RegisterController.verifieduser);

// Endpoint to initiate the forget password process
router.post("/forget-password", RegisterController.forgetpassword);

// Endpoint to handle forget password link with a token
router.get("/forget-passwordlink/:token", RegisterController.forgetpasswordlink);

// Endpoint to update the user's password
router.post("/updatepassword", RegisterController.updatepassword);

// Endpoint for Google login
router.post("/google-login", RegisterController.my_login);

module.exports = router; // Export the router for use in other modules

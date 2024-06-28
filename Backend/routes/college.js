const express = require("express");
const auth = require("../middleware/auth");
const CollegeController = require("../controllers/CollegeController");

const router = express.Router(); // Create a new router

// Endpoint to get all colleges
router.get("/all-college", auth, CollegeController.allcollege);

// Endpoint to mark a college as favorite
router.post("/favourite-college", auth, CollegeController.favcollege);

// Endpoint to get favorite colleges
router.get("/get-fav-college", auth, CollegeController.fetchCollegeData);

// Endpoint to get recommended colleges
router.get("/recommended-college", auth, CollegeController.recommendedCollege);

module.exports = router; // Export the router for use in other modules

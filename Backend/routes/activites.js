const express = require("express");
const auth = require("../middleware/auth");
const ActivitesController = require("../controllers/ActivitiesController");
const upload_clgCampus = require("../middleware/upload_clgCampus");
const upload_commitmentLetter = require("../middleware/upload_commitmentLetter");
const upload_collegeBoard = require("../middleware/upload_collegeBoard");
const upload_fafsa = require("../middleware/upload_fafsa");

const router = express.Router(); // Create a new router

// Endpoint for college match step one
router.post("/college-match-one", auth, ActivitesController.collegematchone); 

// Endpoint to get all college matches
router.get("/college-match-all", auth, ActivitesController.getcollegematchone); 

// Endpoint for college match step two
router.post("/college-match-two", auth, ActivitesController.collegematchtwo); 

// Endpoint for college match step three
router.post("/college-match-three", auth, ActivitesController.collegematchthree); 

// Endpoint for college match step four
router.post("/college-match-four", auth, ActivitesController.collegematchfour); 

// Endpoint for college screen step one
router.post("/college-screen-one", auth, ActivitesController.collegescreenone); 

// Endpoint for uploading college campus file and handling step two
router.post("/college-screen-ClgCampus", auth, upload_clgCampus.single("clg_campus"), ActivitesController.collegescreentwo); 

// Endpoint for college screen step three
router.post("/college-screen-three", auth, ActivitesController.collegescreenthree); 

// Endpoint for uploading commitment letter and handling step four
router.post("/college-screen-commitmentLetter", auth, upload_commitmentLetter.single("commitmentLetter"), ActivitesController.collegescreenfour); 

// Endpoint for college search
router.post("/collegeSearch", auth, ActivitesController.collegesearch); 

// Endpoint for scholar search
router.post("/scholar-search", auth, ActivitesController.scholarsearch); 

// Endpoint for scholar shortlist
router.post("/scholar-shortlist", auth, ActivitesController.scholarshortlist); 

// Endpoint for scholar application
router.post("/scholar-apply", auth, ActivitesController.scholarapply); 

// Endpoint for uploading college board file for scholar application
router.post("/scholar-collegeBoard", auth, upload_collegeBoard.single("college_board_file"), ActivitesController.scholarcollegeBoard); 

// Endpoint for uploading FAFSA file for scholar application
router.post("/scholar-fafsa", auth, upload_fafsa.single("fafsa_file"), ActivitesController.scholarfafsa); 

// Endpoint to get user points
router.get("/user-points", auth, ActivitesController.userpoints); 

module.exports = router; // Export the router for use in other modules

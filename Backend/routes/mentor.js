const express = require("express");
const auth = require("../middleware/mentor_auth");
const mentosController = require("../controllers/mentorsController");
const upload_profileimg = require("../middleware/upload_profile");
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const token = localStorage.getItem("mentortoken");
const router = express.Router(); // Create a new router

// Endpoint to add a mentor
router.post("/mentor-add", mentosController.add);

// Endpoint to update mentor details
router.post("/mentor-update", mentosController.update);

// Endpoint to delete a mentor
router.post("/mentor-delete", mentosController.delete);

// Endpoint to get all mentors
router.get("/mentor-all",mentosController.all_mentors);

// Endpoint to view mentor profile
router.post("/mentor-profile", mentosController.view_profile);

// Endpoint to get mentor signup page
router.get("/mentor-signup", mentosController.mentorsignuppage);

// Endpoint to signup a mentor with profile image upload
router.post("/mentor-signup", upload_profileimg.single("profile"), mentosController.mentorsignup);

// Endpoint to get mentor login page
router.get("/mentor-login", mentosController.mentorloginpage);

// Endpoint to login a mentor
router.post("/mentor", mentosController.mentorlogin);

// Endpoint to login a mentor (alternative endpoint)
router.get("/mentor", mentosController.mentorlogin);

// Endpoint to get chat box for a mentor by ID
router.get("/chat-box/:mentorsId",auth, mentosController.chatbox);

// Endpoint to get mentor profile by ID
router.get("/mentorprofile/:mentorsId",auth, mentosController.mentorprofile);

// Endpoint to update mentor profile with profile image upload
router.post("/mentorupdateprofile",auth, upload_profileimg.single("profile"), mentosController.mentorupdateprofile);

// Endpoint to get edit profile page for a mentor by ID
router.get("/mentor-editprofile/:mentorsId",auth, mentosController.mentoreditprofile);

// Endpoint to get change password page for a mentor by ID
router.get("/changepassword/:mentorsId",auth, mentosController.changepassword);

// Endpoint to update mentor password
router.post("/updatementorPassword",auth, mentosController.updatementorPassword);

// Endpoint to logout a mentor
router.get("/logout",auth, mentosController.logout);

// Endpoint to get live chat for a mentor by ID
router.get("/livechatm/:mentorsId",auth, mentosController.livechatm);

// Endpoint to get chats for a mentor by mentor ID
router.get('/mentor_chats/:mentor_id',auth, mentosController.getMyChats);

module.exports = router; // Export the router for use in other modules

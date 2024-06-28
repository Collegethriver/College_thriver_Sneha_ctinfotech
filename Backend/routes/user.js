const express = require("express");
const auth = require("../middleware/auth");
const Usercontroller = require("../controllers/Usercontroller");
const upload_profileimg = require("../middleware/upload_profile");

const router = express.Router(); // Create a new router

// Endpoint to view user profile
router.get("/viewprofile", auth, Usercontroller.view_profile);

// Endpoint to get user rewards
router.get("/reward", auth, Usercontroller.reward);

// Endpoint to upload profile image
router.post("/uploadprofile", auth, upload_profileimg.single("profile"), Usercontroller.uploadprofile);

// Endpoint to update user details
router.post("/update", auth, Usercontroller.update);

// Endpoint to change user password
router.post("/change-password", auth, Usercontroller.changepassword);

// Endpoint to update user details with profile image upload
router.post("/updatenew", auth, upload_profileimg.single("profile"), Usercontroller.updatenew);

// Endpoint to get all users
router.get("/all", Usercontroller.all_users);

// Endpoint to delete a user
router.post("/delete", auth, Usercontroller.delete);

// Endpoint to get top student
router.get("/top-student", auth, Usercontroller.topstudent);

// Endpoint to chat with a mentor by ID
router.post('/chat_with_mentor/:id', auth, Usercontroller.chat_with_mentor);

// Endpoint to send a message
router.post('/send_message', Usercontroller.sendMessage);

// Endpoint to get all messages in a chat by chat ID
router.get('/all_messages/:chatId', Usercontroller.getAllMessages);

// Endpoint to get all chats of the user
router.get('/my_chats', auth, Usercontroller.geUserChats);

// Endpoint to access live chat
router.get("/livechat", Usercontroller.livechat);

module.exports = router; // Export the router for use in other modules

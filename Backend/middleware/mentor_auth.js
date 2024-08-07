const jwt = require("jsonwebtoken");
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
// const token = localStorage.getItem("mentortoken");
// console.log('token>>>>>>>>>>>>>>>>>>>',token);?
const mentor_auth = (req, res, next) => {
    const token = req.session.mentortoken;
    if (req.session.loggedOut) {
        return res.redirect(`/mentor-login`);
      }
    try {
        const decoded = jwt.verify(token, "your-secret-key");
        console.log('decoded>>>>>>>>', decoded);
        req.mentor = decoded; // Assuming the token payload contains mentor details
        next();
    } catch (err) {
        res.redirect(`/mentor-login`);
        // return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = mentor_auth;

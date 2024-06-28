const multer = require('multer');
const path = require('path');

// Multer configuration for handling image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/profile/'); // Set the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
      // Set the filename to be unique (you can customize this logic)
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload_profile = multer({ storage: storage });
  module.exports = upload_profile
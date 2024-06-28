const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");
const register = require("./routes/register");
const user = require("./routes/user");
const mentor = require("./routes/mentor");
const activite = require("./routes/activites");
const college = require("./routes/college");
const session = require("express-session");
const { initializeSocketIO } = require('./utils/socket')
const { InsertData, GetDataById } = require("./models/commonmodel");

const app = express();

// Create an HTTP server and bind it with the Express app
const server = http.createServer(app);

// Initialize Socket.IO and configure CORS settings
const io = socketIO(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// Make the Socket.IO instance available in the app
app.set("io", io);

// Set up event listeners for Socket.IO
io.on('connection', (socket) => {
  console.log('A mentor connected', session);

  // Handle room joining
  socket.on('join', (data) => {
    const userId = data.userId;
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  // Handle socket disconnection
  socket.on('disconnect', () => {
    console.log('A mentor disconnected');
  });
});

// API endpoint to send a message to a specific room
app.get('/sendMessage', (req, res) => {
  const io = req.app.get('io'); // Get the Socket.IO instance
  io.to("3").emit('new-message', {
    message: "this is the message"
  });
  return res.status(200).json({ success: true, message: 'Message sent successfully.' });
});

// Emit a message to a specific room after 5 seconds (for demonstration purposes)
setTimeout(() => {
  io.to("3").emit('new-message', {
    message: "this is the message"
  });
}, 5000);

// Configure session middleware
app.use(
  session({
    secret: "your-secret-key", // Change this to a random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } ,
  })
);

// Configure middleware to parse URL-encoded and JSON request bodies
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use(bodyParser.json());

// Register route handlers
app.use("/", register);
app.use("/", user);
app.use("/", mentor);
app.use("/", activite);
app.use("/", college);

// Initialize Socket.IO for additional configurations
initializeSocketIO(io);

// Define the root route with CORS headers
app.get("/", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*",
    "http://34.48.5.10:4000",
    {
      reconnect: true,
    }
  );

  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Accept, X-Custom-Header,Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  } else {
    return res.send({ success: true, message: "Hello World" });
  }
});

// Start the server on the specified port
const port = process.env.PORT || 4000; // Default port is 4000, but can be overridden by environment variable PORT
server.listen(port, () => {
  console.log(`Node app is running on port ${port}`);
});

// Export the app for use in other modules (e.g., for testing)
module.exports = app;

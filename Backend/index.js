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
const https = require("https");
const fs = require("fs");

const app = express();

const sslOptions = {
  ca: fs.readFileSync("/var/www/html/ssl/ca_bundle.crt"),
  key: fs.readFileSync("/var/www/html/ssl/private.key"),
  cert: fs.readFileSync("/var/www/html/ssl/certificate.crt"),
};

// const server = http.createServer(app);
const httpsServer = https.createServer(sslOptions, app);
const io = socketIO(httpsServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

app.set("io", io);

io.on('connection', (socket) => {
  console.log('A mentor connected', session);

  // Handle room joining
  socket.on('join', (data) => {
    const userId = data.userId;
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('A mentor disconnected');
  });
});


app.get('/sendMessage', (req, res) => {
  const io = req.app.get('io'); // Assuming you have access to the Socket.IO instance
  io.to("3").emit('new-message', {
    message: "this is the message"
  });
  return res.status(200).json({ success: true, message: 'Message sent successfully.' });
}
)


setTimeout(() => {
  io.to("3").emit('new-message', {
    message: "this is the message"
  });
}, 5000); // Emit after 5 seconds for demonstration purposes


app.use(
  session({
    secret: "your-secret-key", // Change this to a random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } ,
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use(bodyParser.json());

app.use("/", register);
app.use("/", user);
app.use("/", mentor);
app.use("/", activite);
app.use("/", college);

initializeSocketIO(io);

app.get("/", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*",
    "https://www.collegethriverapp.org:4000",
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

const port = process.env.PORT || 4000; // Default port is 8070, but can be overridden by environment variable PORT

httpsServer.listen(port, () => {
  console.log(`Node app is running on port ${port}`);
});

module.exports = app;

const mysql = require('mysql2'); // Import the MySQL library
const util = require('util'); // Import the util library for promisifying callback functions

// Database configuration
var db_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'college_thriver'
};

var connection; // Variable to hold the database connection

// Function to handle database disconnection and reconnection
function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Create a new database connection

  connection.connect(function (err) {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // Try to reconnect after 2 seconds if there is an error
    } else {
      console.log("Connected to MySQL Server!");
    }
  });

  // Handle connection errors
  connection.on('error', function (err) {
    console.log('Cannot connect to Database due to', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect if the connection is lost
    } else {
      throw err; // Throw the error if it's not a connection loss
    }
  });
}

// Call the function to establish the initial connection
handleDisconnect();

// Function to create an object with query and close methods using promisified MySQL functions
function makeDb() {
  return {
    query(sql, args) {
      console.log("db connected localhost");
      console.log(sql); // Log the SQL query
      return util.promisify(connection.query).call(connection, sql, args); // Promisify and call the query method
    },
    close() {
      console.log("db not connected to localhost");
      return util.promisify(connection.end).call(connection); // Promisify and call the end method
    }
  }
}

const db = makeDb(); // Create the database object
module.exports = db; // Export the database object for use in other modules

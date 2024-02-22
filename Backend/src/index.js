const Server = require('./server');

const port = process.env.PORT || 3001; // Define the port to listen on

const server = new Server(port); // Create a new instance of the Server class
server.start(); // Start the server
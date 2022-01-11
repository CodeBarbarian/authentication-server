// The ability to pull params from .env file
require('dotenv').config();

// Declare and initialize the ExpressJS framework
const express = require('express');
const app = express();

// Middleware allows us to access the request.body.<params>
app.use(express.json());

// Including the routers
const loginRouter = require('./Routers/loginRouter');
const registerRouter = require('./Routers/registerRouter');

// Allows the API to use them
app.use('/api/v1', loginRouter);
app.use('/api/v1', registerRouter);

// Retrieve the port number from the configuration file
const PORT = process.env.TOKEN_SERVER_PORT;

/**
 * On start function to prettyfy the code a bit
 */
function onStart() {
    console.log(`Authentication and Authorization server running on ${PORT}`);
}

/**
 * Start the express web server
 */
app.listen(PORT, onStart);
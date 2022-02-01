/**
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 *  @name:      JWT Authentication Server
 *  @version:   1.0
 *  @author:    Morten Haugstad
 *  @description: A simple, easy to use JWT Authentication Server
 * 
 *  @file: app.js
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */

/**
 * The ability to pull params from .env file
 */
require('dotenv').config();

/**
 * Include required module
 */
const express = require('express');
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const helmet = require('helmet');
const morgan = require('morgan')

/**
 * Better Logging in Console
 */
require('log-timestamp');

/**
 * Use the Express Web Server
 */
const app = express();

/**
 * Include Router
 */
const Router = require('./Routers/Router');

/**
 * Use Morgan for logging
 */
 app.use(morgan('combined'))

 /**
  * Security Middleware
  */
 app.use(helmet());
 
 /**
  * Middleware allows us to access the request.body.<params>
  */
 app.use(express.json());
 
 /**
  * Middleware use CORS
  */
 app.use(cors());
 
 /**
  * Middleware to use urlencode
  */
 app.use(express.urlencoded({extended:false}));
 


/**
 * Use Router
 */
app.use('/api/v1', Router);

/**
 * Default route to display swagger
 */
app.use('/api/v1', (req, res, next) => {
    res.json([""]);
})

/**
 * Port Number
 */
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
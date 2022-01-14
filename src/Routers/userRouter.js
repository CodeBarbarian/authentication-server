/**
 * Express to create the router
 */
const express = require('express');
const router = express.Router();

/**
 * Including the controller
 */
const userController = require('../Controllers/userController');

/**
 * Route to handle registration of new user account
 */
router.post('/user/create', userController.registerUser);

/**
 * Post for handling the login of a user
 */
 router.post('/user/login', userController.login);

 /**
  * Refresh for aquiring a new refresh token
  */
 router.post('/user/refresh', userController.refreshToken);
 
 /**
  * Delete to logout
  */
 router.delete('/user/logout', userController.logout);

/**
 * Export the router
 */
module.exports = router;
/**
 * Express to create the router
 */
const express = require('express');
const router = express.Router();

/**
 * Including the controller
 */
const Controller = require('../Controllers/userController');

/**
 * Create New user
 */
router.post('/user/create', Controller.postCreate);

/**
 * Post for handling the login of a user
 */
router.post('/user/login', Controller.postLogin);

/**
 * Refresh for aquiring a new refresh token
 */
router.post('/user/refresh', Controller.postRefreshToken);

/**
 * Delete to logout the user Refresh token only
 */
router.delete('/user/delete', Controller.deleteLogout);

/**
 * Export the router
 */
module.exports = router;
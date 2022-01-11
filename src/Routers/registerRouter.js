/**
 * Express to create the router
 */
 const express = require('express');
 const router = express.Router();

/**
 * Including the controller
 */

const registerController = require('../Controllers/registerController');

router.get('/register', registerController.registerUserTest);
router.post('/register', registerController.registerUser);

/**
 * Export the router
 */
module.exports = router;
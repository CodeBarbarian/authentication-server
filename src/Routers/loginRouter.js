/**
 * Express to create the router
 */
 const express = require('express');
 const router = express.Router();

/**
 * Including the controller
 */

const loginController = require('../Controllers/loginController');

router.get('/login', loginController.loginUserTest);
router.post('/login', loginController.loginUser);

/**
 * Export the router
 */
module.exports = router;
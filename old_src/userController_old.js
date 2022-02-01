const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');

/**
 * Logout
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const logout = (req, res, next) => {
    // Remove the old refresh token from the refresh token list
    refreshTokens = refreshTokens.filter((token) => token != req.body.token);

    res.status(204);
    res.json({
        "message":"logged out"
    })
}

/**
 * Register User
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const registerUser = async(req, res, next) => {
    // Get username and password from request body
    username = req.body.username.toLowerCase();
    password = req.body.password;

    // Declaring variables to be used later
    var UserExists

    // Let us see if we have a real input, meaning both username and password has some value
    if (!username || !password) {
        res.status(401);
        res.json({
            "message": "invalid registration request"
        });
    }

    hashedPassword = await bcrypt.hash(password, 10);

    // Check if username is valid
    if (!userModel.validateUsername(username)) {
        res.json(401);
        res.json({
            "message":"username is not valid"
        });
    } else {
        // Check if the user exists
        await userModel.userExist(username).then((result) => {
            UserExists = result;
        })

        if (!UserExists) {
            // Create user
            await userModel.createUser(username, hashedPassword).then((result) => {
                res.status(201);
                res.json({
                    "username":username,
                    "message":"account created successfully",
                    "claims":""
                });
            });
        } else {
            res.status(409);
            res.json({
                "message":"account already exists"
            });
        }
    }
};

/**
 * Export the modules and functions
 */
module.exports = {
    login,
    refreshToken,
    logout,
    registerUser
}
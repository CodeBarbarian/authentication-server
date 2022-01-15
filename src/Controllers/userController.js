const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');

/**
 * To store the refresh tokens in
 */
let refreshTokens = []

/**
 * Generate the access token
 * 
 * @param {*} user 
 * @returns 
 */
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });
}

/**
 * Generate refresh token
 * 
 * @param {*} user 
 * @returns 
 */
function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "20m"
    });

    refreshTokens.push(refreshToken);
    return refreshToken;
}

/**
 * Helper function to check if the object is empty or not
 * 
 * @param {*} obj 
 * @returns 
 */
function isEmpty(obj) { 
    for (var x in obj) { 
        return false; 
    }
    
    return true;
 }

/**
 * User Login
 * 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const login = async (req, res, next) => {
    // Get the username and password from the request body
    username = req.body.username;
    password = req.body.password;

    // Check if both username and password is passed in the request body
    if (!username || !password) {
        // Bad Request
        res.status(400);
        // Invalid request message framing
        res.json({
            "message":"Bad request message framing"
        })
    }

    /** 
     * Declare variables to be used later
     */
    var UserData
    var UserExists
    
    // Run userExist
    await userModel.userExist(username).then((result) => {
        UserExists = result;
    });

    // Check if user exists
    if (UserExists) {
        // Retrieve user information
        await userModel.getUser(username).then((result) => {
            UserData = result;
        });

        // Compare userdata
        if (!isEmpty(UserData)) {
            // Is user active
            if (UserData[0].active) {
                // Bcrypt Compare passwords
                if (await bcrypt.compare(req.body.password, UserData[0].password)) {
                    // Generate Access Token and Refresh Token here
                    const accessToken = generateAccessToken({user:req.body.username});
                    const refreshToken = generateRefreshToken({user:req.body.username});
                    // Since login succesfull
                    res.status(201);
                    res.json({
                        "accesstoken":accessToken,
                        "refreshtoken":refreshToken
                    })
                } else {
                    // Give message back to the user that the credentials provided are invalid
                    res.status(401);
                    res.json({
                        "message":"Username or password provided is invalid or account has not been activated"
                    })
                    console.log(`${username} has provided invalid login credentials. Failed password.`)
                }
            } else {
                res.status(401);
                res.json({
                    "message":"Username or password provided is invalid or account has not been activated"
                })
                console.log(`${username} is not active, and is unable to perform the request.`)
            }
        } else {
            res.status(401);
            res.json({
                "message":"Username or password provided is invalid or account has not been activated"
            })
            console.log(`${username} does not exist.`)
        }
    }
}

/**
 * Refresh token
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const refreshToken = (req, res, next) => {
    if (!refreshTokens.includes(req.body.token)) {
        res.status(400);
        res.json({
            "message":"refresh token invalid"
        });
    }

    // Remove the old refresh token
    refreshTokens = refreshTokens.filter((token) => token != req.body.token);

    const accessToken = generateAccessToken({user:req.body.username});
    const refreshToken = generateRefreshToken({user:req.body.username});

    res.status(201);
    res.json({
        "accesstoken":accessToken,
        "refreshtoken":refreshToken
    })
}

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
const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');

/**
 * To store the refresh tokens in
 */
let refreshTokens = []

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    });
}

function generateRefreshToken(user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "20m"
    });

    refreshTokens.push(refreshToken);
    return refreshToken;
}

const login = async (req, res, next) => {
    username = req.body.username;
    password = req.body.password;

    if (!username || !password) {
        res.status(401);
        res.json({
            "message":"invalid login request"
        })
    }
    /** 
     * Declare variables to be used later
    */
    var UserData
    var UserExists
    
    await userModel.userExist(username).then((result) => {
        UserExists = result;
    });

    // Check if user exists
    if (UserExists) {
        await userModel.getUser(username).then((result) => {
            UserData = result;
        });

        // Compare userdata
        if (UserData) {
            // Bcrypt Compare
            if (await bcrypt.compare(req.body.password, UserData[0].password)) {
                // Generate Access Token and Refresh Token here

                const accessToken = generateAccessToken({user:req.body.username});
                const refreshToken = generateRefreshToken({user:req.body.username});

                res.status(201);
                res.json({
                    "accesstoken":accessToken,
                    "refreshtoken":refreshToken
                })
            } else {
                // Give message back to the user that the credentials provided are invalid
                res.status(401);
                res.json({
                    "message":"provided credentials are not valid"
                })
            }
        }
    }
}

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

const logout = (req, res, next) => {
    // Remove the old refresh token from the refresh token list
    refreshTokens = refreshTokens.filter((token) => token != req.body.token);

    res.status(204);
    res.json({
        "message":"logged out"
    })
}


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


module.exports = {
    login,
    refreshToken,
    logout,
    registerUser
}
const validator = require('validator');
const helper = require('../Library/Haugstad');
const database = require('../Library/Database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        expiresIn: "1m"
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

const postLogin = async (table, username, password) => {
    var UserData = [];
    
    // Check if we have everyting
    if (helper.isEmpty(table) || helper.isEmpty(username) || helper.isEmpty(password)) {
        return false;
    }

    // Async call to check if the user exists
    await database.getEntryByField('users', username, 'username').then((result) => {
        UserData = result;
    });

    // Performing the actual check if the user exist
    if (helper.isEmpty(UserData)) {
        return false;
    } else {
        // Easier to manipulate object one down
        UserData = UserData[0];

        // Check if user is active
        if (UserData.active !== 1) {
            return false;
        }

        // Compare to see if the password matches
        if (!(await bcrypt.compare(password, UserData.password))) {
            return false;
        } 

        // If all else works. Send the accesstoken, and the refreshtoken.
        const accessToken = generateAccessToken({user: username});
        const refreshToken = generateRefreshToken({user: username});

        // return the accesstoken and refreshtoken
        return ({
            "accesstoken":accessToken,
            "refreshtoken":refreshToken
        });

    }
};

const postRefreshToken = async (requestBody) => {
    if (helper.isEmpty(requestBody)) {
        return false;
    }

    if (!refreshTokens.includes(requestBody.token)) {
        return false;
    }

    // remove the old refresh token
    refreshTokens = refreshTokens.filter((token) => token != requestBody.token);

    // If all else works. Send the accesstoken, and the refreshtoken.
    const accessToken = generateAccessToken({user: requestBody.username});
    const refreshToken = generateRefreshToken({user: requestBody.username});

    // return the accesstoken and refreshtoken
    return ({
        "accesstoken":accessToken,
        "refreshtoken":refreshToken
    });
};

const deleteLogout = async(requestBody) => {
    return new Promise((resolve, reject) => {
        if (helper.isEmpty(requestBody)) {
            reject(true);
        }

        refreshTokens = refreshTokens.filter((token) => token != requestBody.token);
        resolve(false);
    });
};

const postCreate = async () => {

};

module.exports = {
    postLogin,
    postRefreshToken,
    deleteLogout,
    postCreate
}
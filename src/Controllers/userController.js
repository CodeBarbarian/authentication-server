const userModel = require('../Models/userModel');
const helper = require('../Library/Haugstad');

const postLogin = async(req, res, next) => {
    if (helper.isEmpty(req.body.username) || helper.isEmpty(req.body.password)) {
        helper.sendResponse(res, 400);
    } else {
        var username = req.body.username;
        var password = req.body.password;
        var UserData = [];

        await userModel.postLogin('users', username, password).then((result) => {
            UserData = result;
        })

        if (helper.isEmpty(UserData)) {
            helper.sendResponse(res, 400, ["unable to authorize user"]);
        } else {
            helper.sendResponse(res, 200, UserData);
        }
    }
};

const postRefreshToken = async(req, res, next) => {
    var RefreshTokenData = [];
    
    if (helper.isEmpty(req.body.token)) {
        helper.sendResponse(res, 400, {"message":"refresh token invalid"});
    } else {
        await userModel.postRefreshToken(req.body).then((result) => {
            RefreshTokenData = result;
        });

        if (helper.isEmpty(RefreshTokenData)) {
            helper.sendResponse(res, 400, {"message":"refresh token invalid"});
        } else {
            helper.sendResponse(res, 201, RefreshTokenData);
        }
    }
};

const deleteLogout = async(req, res, next) => {
    var RefreshTokenData = [];

    await userModel.deleteLogout(req.body).then((result) => {
        RefreshTokenData = result;
    })

    if (helper.isEmpty(RefreshTokenData)) {
        helper.sendResponse(res, 400);
    } else {
        helper.sendResponse(res, 204, {"message":"logged out"});
    }
};

const postCreate = async(req, res, next) => {
    var UserData = [];

    // Check if everything which is required is posted
    if (helper.isEmpty(req.body.username) || helper.isEmpty(req.body.password)) {
        helper.sendResponse(res, 400);
    } else {
        // Simplicity
        var Username = req.body.username.toLowerCase();
        var Password = req.body.password;

        await userModel.postCreate('users', Username, Password).then((result) => {
            UserData = result;
        });

        if (helper.isEmpty(UserData)) {
            helper.sendResponse(res, 400);
        } else {
            helper.sendResponse(res, 201, UserData);
        }
    }
};

module.exports = {
    postLogin,
    postRefreshToken,
    deleteLogout,
    postCreate
}
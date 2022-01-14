const jwt = require('jsonwebtoken');


/**
 * This function can be run to validate the JWT token and authorize 
 * access towards resources. 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function validateToken (req, res, next) {
    if (!req.headers["authorization"]) {
        res.status(400);
        res.json({
            "message":"requires authorization header to be set"
        })
    } else {
        // Get Token from request header
        const authorization = req.headers["authorization"];
        const token = authorization.split(" ")[1];

        if (token == null) {
            res.status(400).send({
                "message":"token not Present"
            });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) {
                res.status(403).send({
                    "message":"token invalid"
                });
            } else {
                req.user = user;
                next();
            }
        })
    }
}

module.exports = {
    validateToken
}
loginUserTest = async(req, res, next) => {
    res.status(200);
    res.json(["Logging in user with GET METHOD"]);

}

loginUser = async(req, res, next) => {
    res.status(200);
    res.json(["Logging in user with POST METHOD"])
}


module.exports = {
    loginUser,
    loginUserTest
}
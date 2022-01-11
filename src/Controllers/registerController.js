registerUserTest = async(req, res, next) => {
    res.status(200);
    res.json(["Registering user GET METHOD"]);

}

registerUser = async(req, res, next) => {
    res.status(200);
    res.json(["Registering User POST Method"])
}


module.exports = {
    registerUser,
    registerUserTest
}
const jwt = require("jsonwebtoken");

//===================================================[API:FOR AUTHENTICATION]===========================================================
exports.authentication = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"] || req.headers["X-API-KEY"]
        if (!token) {
            return res.status(401).send({ status: false, message: "token must be present" })
        }
        let decodedtoken = jwt.verify(token, 'lama');
        req.loggedInUser = decodedtoken.userId
        next();
    }
    catch (err) { return res.status(500).send({ status: false, message: err.message }); }
}
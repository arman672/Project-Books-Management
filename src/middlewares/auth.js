const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");

//===================================================[API:FOR AUTHENTICATION]===========================================================
exports.authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"] || req.headers["X-API-KEY"]
        if (!token) {
            return res.status(401).send({ status: false, message: "token must be present" })
        }
        let decodedtoken = jwt.verify(token, 'lama');
        if (!decodedtoken) {
            return res.status(400).send({ status: false, message: "Invalid authentication token in request headers." })
        }
        if (Date.now() > (decodedtoken.exp) * 1000) {
            return res.status(400).send({ status: false, message: "Session expired! Please login again." })
        }
        req.loggedInUserId = decodedtoken.userId
        next();
    }
    catch (err) { return res.status(500).send({ status: false, message: err.message }); }
}

//===================================================[API:FOR AUTHORIZATION]===========================================================
exports.authorization = async function (req, res, next) {
    try {
        //for update delete
        const idInParams = req.params.bookId

        if (idInParams) {
            if (!mongoose.isValidObjectId(idInParams)) {
                return res.status(400).send({ status: false, message: "enter valid bookid" })
            }
        }

        if (idInParams) {
            const bookOwner = await bookModel.findOne({ _id: idInParams })
            if (req.loggedInUserId == bookOwner.userId) {
                return next();
            } else {
                return res.status(403).send({ status: false, message: "you are not authroized to perform this operation" });
            }
        }

        //for create
        const idInBody = req.body.userId

        if (!idInBody) return res.status(400).send({ status: false, message: "userid is required" });
        if (!mongoose.isValidObjectId(idInBody)) {
            return res.status(400).send({ status: false, message: "enter valid userId" })
        }

        if (idInBody) {
            if (req.loggedInUserId == idInBody) {
                return next();
            } else {
                return res.status(403).send({ status: false, message: "you are not authroized to perform this operation" });
            }
        }
    }
    catch (err) { return res.status(500).send({ status: false, message: err.message }); }
}
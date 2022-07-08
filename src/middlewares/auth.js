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
            const bookOwner = await bookModel.findOne({ _id: idInParams })
            if (req.loggedInUserId == bookOwner.userId) {
                console.log("hello")
                return next();
            } else {
                return res.status(403).send({ status: false, message: "you you are not authroized to perform this operation" });
            }
        }

        //for create
        const idInBody = req.body.userId
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
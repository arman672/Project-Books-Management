const userModel = require('../models/userModel')

exports.registerUser = async function (req, res) {
    try {
        const userData = req.body
       // if(!validator.validateMissingData(userData)) 
       // return res.status(400).send({status: false, message:validator.validateMissingData})
        const createUser = await userModel.create(userData)
        res.status(201).send({status: true, message:"Registered succesfully", data:{createUser}})
    }catch(err){
        res.status(500).send({ status: false, message: err.message });
    }
};
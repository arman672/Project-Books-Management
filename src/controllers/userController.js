const userModel = require('../models/userModel')
const validator = require ("email-validator")

exports.registerUser = async function (req, res) {
    try {
        const userData = req.body
        let { title, name, phone, email, password, address} = userData;

        //title validation
        if (!title)
        return res.status(404).send({ status: false, msg: "tittle missing" });
        let validTitle = ["Mr", "Mrs", "Miss"];  
        if (!validTitle.includes(title))
        return res.status(400).send({ status: false, msg: "Title should be one of Mr, Mrs, Miss" });

        //name validation
        if (!name) {
            return res.status(400).send({ status: false, message: "name is a required field" })
        }
        if (!name.match(/^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,24}$/gi)) {
            return res.status(400).send({ status: false, message: "please enter valid name" })
        }

        //phone validation
        if (!phone) {
            return res.status(400).send({ status: false, message: "phone is a required field" })
        }
        if(!phone.match(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/g)){ 
            return res.status(400).send({status : false, message : "This is not a valid Mobile Number, only indian numbers are accepted."})
        } 

        //email validation
        if(!email){
            return res.status(400).send({status : false, message : "email is a required field"})
        }
        const validEmail = validator.validate(email)
        if(!validEmail){
            return res.status(400).send({status : false, message : "email is not valid"})
        } 

        //password validation
        if(!password){
            return res.status(400).send({status : false, message : "password is a required field"})
        }
        const length = password.length
        if(length < 8 || length > 15){
            return res.status(400).send({status : false, message : "password length must be between 8 to 15 charecters long"})
        } 
        
        //address validation
        if(address.pincode){
            if(!address.pincode.match(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/g)){ 
                 return res.status(400).send({status : false, message : "pincode is a not valid"})
            }
        }
        const createUser = await userModel.create(userData)
        res.status(201).send({status: true, message:"Registered succesfully", data:{createUser}})
    }catch(err){
        res.status(500).send({ status: false, message: err.message });
    }
};
const userModel = require('../models/userModel')
const validator = require("email-validator")
const jwt = require("jsonwebtoken")

exports.registerUser = async function (req, res) {
    try {
        const userData = req.body

        if (Object.keys(userData).length == 0) {
            return res.status(400).send({ status: false, message: "Plese enter the mandatory details" })
        }

        let { title, name, phone, email, password, address } = userData;

        //title validation
        if (!title)
            return res.status(404).send({ status: false, message: "tittle missing" });
        let validTitle = ["Mr", "Mrs", "Miss"];
        if (!validTitle.includes(title))
            return res.status(400).send({ status: false, message: "Title should be one of Mr, Mrs, Miss" });

        //name validation
        if (!name) {
            return res.status(400).send({ status: false, message: "name is a required field" })
        }
        if (!name.match(/^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,24}$/gi)) {
            return res.status(400).send({ status: false, message: "please enter valid name" })
        }

        //phone validation
        phone = phone.toString()
        if (!phone) {
            return res.status(400).send({ status: false, message: "phone is a required field" })
        }
        if (!phone.match(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/g)) {
            return res.status(400).send({ status: false, message: "This is not a valid Mobile Number, only indian numbers are accepted." })
        }

        //email validation
        if (!email) {
            return res.status(400).send({ status: false, message: "email is a required field" })
        }
        const validEmail = validator.validate(email)
        if (!validEmail) {
            return res.status(400).send({ status: false, message: "email is not valid" })
        }

        //password validation
        if (!password || password.trim().length == 0) {
            return res.status(400).send({ status: false, message: "password is a required field" })
        }
        const length = password.length
        if (length < 8 || length > 15) {
            return res.status(400).send({ status: false, message: "password length must be between 8 to 15 charecters long" })
        }

        //address validation
        if (address) {
            if (typeof address != "object") return res.status(400).send({ status: false, message: "address must be of type object" })
            if (address.pincode || address.pincode.trim().length == 0) {
                if (!address.pincode.match(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/g)) {
                    return res.status(400).send({ status: false, message: "pincode is a not valid" })
                }
            }
            if (address.city) {
                if (address.city.trim().length == 0) {
                    return res.status(400).send({ status: false, message: "city cannot be empty" })
                }
            }
            if (address.street) {
                if (address.street.trim().length == 0) {
                    return res.status(400).send({ status: false, message: "street cannot be empty" })
                }
            }
        }

        const checkDuplicateEmail = await userModel.findOne({ email: email })
        if (checkDuplicateEmail) {
            return res.status(400).send({ status: false, message: "email is already registered" })
        }

        const checkDuplicatePhone = await userModel.findOne({ phone: phone })
        if (checkDuplicatePhone) {
            return res.status(400).send({ status: false, message: "phone no is already registered" })
        }

        const createUser = await userModel.create(userData)
        return res.status(201).send({ status: true, message: "Success", data: createUser })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

//===================================================[API:FOR AUTHOR LOGIN]===========================================================
exports.loginUser = async function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;

        //email validation 
        if (!email) {
            return res.status(400).send({ status: false, message: "email is a required field" })
        }
        const validEmail = validator.validate(email)
        if (!validEmail) {
            return res.status(400).send({ status: false, message: "email is not valid" })
        }

        //password validation
        if (!password || password.trim().length == 0) {
            return res.status(400).send({ status: false, message: "password is a required field" })
        }
        const length = password.length
        if (length < 8 || length > 15) {
            return res.status(400).send({ status: false, message: "password length must be between 8 to 15 charecters long" })
        }

        let user = await userModel.findOne({ email: email, password: password, });

        if (!user) {
            return res.status(401).send({ status: false, message: "email or password is not correct"});
        }

        let token = jwt.sign({ userId: user._id.toString() }, "lama", { expiresIn: "3d", });

        return res.status(200).send({ status: true, message: "Success", data: { token: token } });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

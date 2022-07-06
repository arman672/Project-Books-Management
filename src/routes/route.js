const express = require('express')
const bookController= require('../controllers/bookController')
const userController= require('../controllers/userController')
const router = express.Router()

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.post("/books", bookController.createBook);


module.exports=router
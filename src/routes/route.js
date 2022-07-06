const express = require('express')
const bookController= require('../controllers/bookController')
const userController= require('../controllers/userController')
const router = express.Router()

router.post("/register", userController.registerUser);
router.post("/books", bookController.createBook);
router.get("/books", bookController.getBook);

module.exports=router
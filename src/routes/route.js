const express = require('express')
const bookController= require('../controllers/bookController')
const userController = require('../controllers/userController')
const mw = require('../middlewares/auth')
const router = express.Router()

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.post("/books", mw.authentication,mw.authorization, bookController.createBook);
router.get("/books", mw.authentication,mw.authorization, bookController.getBook);
router.get("/books/:bookId", mw.authentication,mw.authorization, bookController.bybookId);
router.put("/books/:bookId", mw.authentication,mw.authorization, bookController.updateBook);


module.exports=router
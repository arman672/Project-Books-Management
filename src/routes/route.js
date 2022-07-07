const express = require('express')
const bookController= require('../controllers/bookController')
const userController = require('../controllers/userController')
const mw = require('../middlewares/auth')
const router = express.Router()

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.post("/books", mw.authentication,mw.authorization, bookController.createBook)
;
router.get("/books", mw.authentication,mw.authorization, bookController.getBook);

router.put("/books/:bookId", mw.authentication,mw.authorization, bookController.updateBook);

router.get("/books/:bookId", bookController.bybookId);

//router.delete("/books/:bookId", bookController.deleteById);

module.exports=router
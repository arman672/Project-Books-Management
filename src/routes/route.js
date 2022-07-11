const express = require('express')
const bookController= require('../controllers/bookController')
const userController = require('../controllers/userController')
const reviewController = require('../controllers/reviewController')
const mw = require('../middlewares/auth')
const router = express.Router()

//user api's

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

//book api's

router.post("/books", mw.authentication,mw.authorization, bookController.createBook);

router.get("/books", mw.authentication, bookController.getBook);

router.put("/books/:bookId", mw.authentication,mw.authorization, bookController.updateBook);

router.get("/books/:bookId",mw.authentication, bookController.getBookById);

router.delete("/books/:bookId",mw.authentication,mw.authorization,bookController.deleteBookById);

//review api's

router.post("/books/:bookId/review",reviewController.createReview);

router.put("/books/:bookId/review/:reviewId",reviewController.updateReview);

router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview);

module.exports=router

const reviewModel = require('../models/reviewModel')
const mongoose = require("mongoose")
const book = require("../models/bookModel")

const createReview = async (req, res) => {
    try {
        let bookId = req.params.bookId
        let data = req.body

        let { review, reviewedBy, rating, reviewedAt} = data

        if (!bookId) {
            return res.status(400).send({ status: false, message: 'bookId is not present' })
        }

        let validateBookId = mongoose.isValidObjectId(bookId)
        if (!validateBookId) {
            return res.status(400).send({ status: false, message: 'this is not a valid book Id' })
        }

        let findBook = await book.findOne({ bookId })
        if (!findBook) {
            return res.status(404).send({ status: false, message: 'no books with this Books id' })
        }

        if (findBook.isDeleted) {
            return res.status(404).send({ status: false, message: 'This book has been deleted' })
        }

        if (rating == 0) return res.status(400).send({ status: false, message: 'please provide a valid rating' })

        if (!rating) {
            return res.status(400).send({ status: false, message: 'rating is a required field' })
        }

        if (!(rating <= 5 && rating >= 1)) {
            return res.status(400).send({ status: false, message: 'please provide a valid rating' })
        }

        if (reviewedBy) {
            if (reviewedBy.trim().length === 0) {
                return res.status(400).send({ status: false, message: 'reviewers name can not be empty' })
            }
        }

        if (!review) {
            return res.status(400).send({ status: false, message: 'review is a required field' })
        }

        if (review.trim().length === 0) {
            return res.status(400).send({ status: false, message: 'review can not be empty' })
        }

        if (!reviewedAt) {
            return res.status(400).send({ status: false, message: 'reviewedAt is a required field' })
        }

        let datePattern = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/g
        if (!data["reviewedAt"].match(datePattern)) {
            return res.status(400).send({ status: false, message: "Date format is not valid" })
        }


        const checkIfBookIsDeleted = await book.findOne({ _id: bookId, isDeleted: false })
        if (!checkIfBookIsDeleted) return res.status(404).send({ status: false, message: 'Book not found' })

        data['bookId'] = bookId

        let checkDetails = await reviewModel.exists(data)

        if (checkDetails) {
            return res.status(400).send({ status: false, message: 'a review with this details already exists, please update it' })
        }

        let reviewCreated = await reviewModel.create(data)

        if (reviewCreated) {

            let updatedBook = await book.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } }, { new: true }).lean()

            updatedBook['reviewData'] = reviewCreated

            return res.status(201).send({ status: true, message: "Review published", data: updatedBook })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const updateReview = async (req, res) => {
    try {
        const bookid = req.params.bookId
        const reviewid = req.params.reviewId
        const data = req.body

        if (!bookid) return res.status(400).send({ status: false, message: 'bookId is mandatory' })
        if (!reviewid) return res.status(400).send({ status: false, message: 'reviewId is mandatory' })
        if (!mongoose.isValidObjectId(bookid)) return res.status(400).send({ status: false, message: 'Please enter a valid book id' })
        if (!mongoose.isValidObjectId(reviewid)) return res.status(400).send({ status: false, message: 'Please enter a valid book id' })

        const findBook = await book.findOne({ _id: bookid, isDeleted: false })
        if (!findBook) return res.status(404).send({ status: false, message: 'book not found!' })

        const findReview = await reviewModel.findOne({ _id: reviewid, isDeleted: false }).select({review:1,rating:1,reviewedBy:1})
        if (!findReview) return res.status(404).send({ status: false, message: 'review not found!' })

        if (data.review) {
            if(data.review.trim().length == 0) return res.status(400).send({ status: false, message: 'review is a cannot be empty'})
            findReview.review = data.review
        }
        if (data.rating && data.rating == 0) {
            let rating = parseInt(data.rating)
            if(rating < 1 || rating >5) return res.status(400).send({ status: false, message: 'rating must be between 1-5'})
            findReview.rating = rating
        }
        if (data.reviewedBy) {
            if(data.reviewedBy.trim().length == 0) return res.status(400).send({ status: false, message: 'reviewed by cannot be empty'})
            findReview.reviewedBy = data.reviewedBy
        }
        findReview.save()
        return res.status(200).send({ status: true, message: "Review published", data:{ findReview }})
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const deleteReview = async (req, res) => {
    try {
        const bookid = req.params.bookId
        const reviewid = req.params.reviewId

        if (!bookid) return res.status(400).send({ status: false, message: 'bookId is mandatory' })
        if (!reviewid) return res.status(400).send({ status: false, message: 'reviewId is mandatory' })
        if (!mongoose.isValidObjectId(bookid)) return res.status(400).send({ status: false, message: 'Please enter a valid book id' })
        if (!mongoose.isValidObjectId(reviewid)) return res.status(400).send({ status: false, message: 'Please enter a valid book id' })

        const findBook = await book.findOne({ _id: bookid, isDeleted: false })
        if (!findBook) return res.status(404).send({ status: false, message: 'book not found!' })

        const findReview = await reviewModel.findOneAndUpdate({ _id: reviewid, isDeleted: false}, {isDeleted: true})
        if (!findReview) return res.status(404).send({ status: false, message: 'review not found!'})
        else return res.status(200).send({ status: true, message: 'successfully deleted!' })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createReview, updateReview, deleteReview}
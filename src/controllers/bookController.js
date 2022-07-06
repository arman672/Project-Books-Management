const book = require("../models/bookModel");
const mongoose = require("mongoose");
const user = require("../models/userModel");
//const review = require("../models/reviewModel");

const createBook = async (req, res) => {
    try {
        let bookData = req.body;
        let { title, userId, ISBN, category, subcategory, excerpt, releasedAt } =
            bookData;

        if (title) {
            if (title.trim().length === 0) {
                return res.status(400).send({ status: false, message: "Title can not be empty" })
            }
        }  
         else {return res.status(400).send({ status: false, message: "Title is a required field" })}

        let isUniqueTitle = await book.findOne({ title: title });
            if (isUniqueTitle) {
            return res.status(400).send({ status: false, message: "This title is being already used" })
        }

        if (excerpt) {
            if (excerpt.trim().length === 0) {
                return res.status(400).send({ status: false, message: "excerpt can not be empty" })
            }
        } 
         else {return res.status(400).send({ status: false, message: "excerpt is a required field" })}

         if (userId) {
            let validUserId = mongoose.isValidObjectId(userId);
            if (!validUserId) {
                return res.status(400).send({ status: false, message: "This is not a valid user id" })
            }

            let findUser = await user.findOne({_id : userId });
            if (!findUser) {
                return res.status(400).send({ status: false, message: "User with this Id does not exist" })
            }
        }
         else {return res.status(400).send({ status: false, message: "User Id is a required field" })}

         if (ISBN) {
            let isbnPattern = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/g

            if (!ISBN.match(isbnPattern)) {
                return res.status(400).send({ status: false,message: "Please provide a valid ISBN number"})
            }
        } 
        else {return res.status(400).send({ status: false, message: "ISBN Number is a required field" })}

        let isUniqueISBN = await book.findOne({ ISBN: ISBN });

        if (isUniqueISBN) {
            return res.status(400).send({ status: false, message: "This ISBN is already being used" })
        }

        if(category) {
            if (category.trim().length === 0) {
                return res.status(400).send({ status: false, message: "category cannot be empty" })
            }
        }
        else {return res.status(400).send({ status: false, message: "category is a required field" })}

        if (subcategory) {
            if (subcategory.length === 0) {
                return res.status(400).send({ status: false, message: "subcategory is cannot be empty" })
            }
        } 
        else {return res.status(400).send({ status: false, message: "subcategory is a required field" })}

            if (Array.isArray(subcategory)) {
                let uniqueSub = [...new Set(subcategory)];
                bookData.subcategory = uniqueSub;
            }

        if (releasedAt) {
                let datePattern = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/g
                if (!releasedAt.match(datePattern)) {
                    return res.status(400).send({ status: false, message: "Date format is not valid" })
                }  //'1998-10-24'
            }
         else {return res.status(400).send({ status: false, message: "Released date is a required field" })}
    
           
                let saveBook = await book.create(bookData);
                return res.status(201).send({status: true,message: "your book has been saved",data: saveBook})
                    
        }
         catch (err) { return res.status(500).send({ status: false, message: err.message })}
    }

    module.exports = { createBook };

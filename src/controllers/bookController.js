const book = require("../models/bookModel");
const mongoose = require("mongoose");
const user = require("../models/userModel");
const review = require("../models/reviewModel");

const createBook = async (req, res) => {
    try {
        let bookData = req.body

        if(Object.keys(bookData).length == 0){
            return res.status(400).send({status : false, message : "Plese enter the mandatory details"})
        }

        let { title, userId, ISBN, category, subcategory, excerpt, releasedAt } = bookData;
        
        // title validation
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

        // excerpt validation

        if (excerpt) {
            if (excerpt.trim().length === 0) {
                return res.status(400).send({ status: false, message: "excerpt can not be empty" })
            }
        } 
         else {return res.status(400).send({ status: false, message: "excerpt is a required field" })}

         // userId validation

         if (userId) {
            let validUserId = mongoose.isValidObjectId(userId);
            if (!validUserId) {
                return res.status(400).send({ status: false, message: "This is not a valid user id" })
            }

            let findUser = await user.findOne({_id : userId });
            if (!findUser) {
                return res.status(404).send({ status: false, message: "User with this Id does not exist" })
            }
        }
         else {return res.status(400).send({ status: false, message: "User Id is a required field" })}
        
         // ISBN validation

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
        
        // category validation

        if(category) {
            if (category.trim().length === 0) {
                return res.status(400).send({ status: false, message: "category cannot be empty" })
            }
        }
        else {return res.status(400).send({ status: false, message: "category is a required field" })}
        
        // subcategory validation

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
    
       // releasedAt validation

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
          //========================================================//====================================================//
    
          const getBook = async (req, res) => {
            try {
                let data = req.query
                let { userId, category, subcategory } = data
                let filter = {
                    isDeleted: false,
                    ...data
                };
        
                if (userId) {
                    let verifyuser = mongoose.isValidObjectId(userId)
                    if (!verifyuser) {
                        return res.status(400).send({ status: false, message: "this is not a valid user Id" })
                    }
        
                    let findbyUserId = await book.findOne({ userId });
                    if (!findbyUserId) {
                        return res.status(404).send({ status: false, message: "no books with this userId exists" })
                    }
                }
                if (category) {
                    let findbyCategory = await book.findOne({ category : category })
                    if (!findbyCategory) {
                        return res.status(404).send({status: false, message: "no books with this category exists" })
                    }
                }

                if (subcategory) {
                    let findbysubcategory = await book.findOne({ subcategory: subcategory })
                    if (!findbysubcategory) {
                        return res.status(404).send({status: false,message: "no books with this subcategory exists"})
                    }
                }
                let findBook = await book.find(filter).select({ _id: 1,title: 1,excerpt: 1,userId: 1,category: 1,releasedAt: 1,reviews: 1,}).sort({ title: 1 })

                if (!findBook.length) {
                    return res.status(404).send({ status: false, message: "No books with this query exists" })
                } 
                else { return res.status(200).send({ status: true, message: "Book List", data: findBook })
                }
            } 
            catch (err) {return res.status(500).send({ status: false, message: err.message })}
        }

        //=======================================================//===========================================================//
        
        const bybookId = async (req, res) => {
            try {
                let bookId = req.params.bookId
        
                if (bookId) {
                    let verifyBookId = mongoose.isValidObjectId(bookId)
                    if (!verifyBookId) {
                        return res.status(400).send({ status: false, message: "this is not a valid bookId " })
                    }
                }
                 else {return res.status(400).send({status: false,message: "Book Id must be present in order to search it"})}
        
                let findBook = await book.findOne({ _id: bookId }).lean()
        
                if (!findBook) {
                    return res.status(404).send({status: false,message: "No document exists with this book Id"})
                }
        
                if (findBook.isDeleted === true) {
                    return res.status(404).send({status: false,message: "This book has been deleted by the user"});
                }
        
                let findReview = await review.find({ bookId: findBook._id, isDeleted : false })
                
               findBook["reviewsData"] = findReview
                
                //if we don't use lean then we have to do this to get the expected results
        
                /* let details = {
                        _id : findBook._id,
                        title : findBook.title,
                        excerpt : findBook.excerpt,
                        userId : findBook.userId,
                        category : findBook.category,
                        subcategory : findBook.subcategory,
                        deleted : false,
                        reviews : findReview.length,
                        deletedAt : findBook.deletedAt,
                        releasedAt : findBook.releasedAt,
                        createdAt : findBook.createdAt,
                        updatedAt : findBook.updatedAt,
                        reviewsData : findReview
                    } 
            
                */
        
                return res.status(200).send({ status: false, message: "Book details", data: findBook })
            } catch (err) {return res.status(500).send({ status: false, message: err.message })}
        }
        

          module.exports = { createBook,getBook,bybookId };

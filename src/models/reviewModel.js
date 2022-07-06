const { default: mongoose } = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewModel =  new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref:'Book' , 
        
    },
    reviewedBy: {
        type : String, 
        default: 'Guest', 
        required : true,
        trim : true
    },
    
    reviewedAt: {
        type :Date,  
        default : Date.now()
    },

    rating: {
        type :Number, 
        min : 1, 
        max : 5, 
        },
    review: {
        type : String
    },
    isDeleted: {
        type :Boolean, 
        default: false},
  }, {timestamps : true})

  module.exports = new mongoose.model('Review', reviewModel)
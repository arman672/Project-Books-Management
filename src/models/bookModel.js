const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId
// reference & populate
const bookSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        unique : true
    },

    excerpt : {
        type : String,
        required : true
    },

    userId : {
        type : ObjectId,
        ref : 'User',
        required : true
    },

    ISBN : {
        type : String,
        required : true,
        unique : true
    },

    category : {
        type : String,
        required : true
    },
    
    subcategory : {
        type : [String],
        required : true
    },
    reviews : {
        type : Number,
        default: 0,
       //comment : holds the number of the reviews
    },
    deletedAt : {
        type : Date
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    releasedAt : {
        type : Date,
        default : Date.now(),
    }
},{timestamps : true})

module.exports = mongoose.model('Book', bookSchema)
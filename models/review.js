const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema ({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
        createAt:{
            type: Date,
            default:Date.now(),
        }
    

});

module.exports=mongoose.model("Review",reviewSchema);
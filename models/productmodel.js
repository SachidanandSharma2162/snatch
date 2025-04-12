const mongoose = require('mongoose');

const productSchema=mongoose.Schema({
    image:{
        data:Buffer,
        contentType:String
    },
    name:String,
    price:Number,
    discount:{
        type:Number,
        default:0
    },
    bgcolor:String,
    panelcolor:String,
    textcolor:String,
    review: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        text: {
            type: String,
            required: true
        }
    }]
})

module.exports=mongoose.model("product",productSchema)

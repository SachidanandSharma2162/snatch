const mongoose = require('mongoose');

const ownerSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength:3,
        trim: true
    },
    email:String,
    password:String,
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"product"
    }],
    contact:Number,
    picture:String,
    gstin:String,
    orders:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"product"
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        count:{
            type:Number,
            default:0
        }
    }]
});

module.exports=mongoose.model("owner",ownerSchema)

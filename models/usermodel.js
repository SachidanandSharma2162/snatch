const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength:3,
        trim: true
    },
    email:String,
    password:String,
    cart:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"product"
        },
        count:{
            type:Number,
            default:0
        }
    }],
    orders:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product"
        },
        count:{
            type:Number,
            default:0
        }
    }],
    contact:Number,
    picture: {
        data: Buffer,
        contentType: String
      },
    address:{
        housenumber:Number,
        area:String,
        nearyby:String,
        state:String,
        country:String,
        pincode:Number
    }
});

module.exports=mongoose.model("user",userSchema)

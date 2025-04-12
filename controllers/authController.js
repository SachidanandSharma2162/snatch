const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const usermodel=require('../models/usermodel');
const {generateToken}=require('../utils/generateToken');

module.exports.registerUser=async function(req,res){
    try {
        let {fullname, email, password}=req.body;
        let user=await usermodel.findOne({email:email});
        if(user){
            // res.status(400).send("You already have an account. Please Login!")
            req.flash("error", "You already have an account. Please Login!");
            return res.redirect('/')
        }
        else{
            bcrypt.genSalt(10, function(err, salt) {
              bcrypt.hash(password, salt,async function(err, hash) {
                if(err) return res.status(400).send(err.message);
                else{
                  let createdUser=await usermodel.create({
                    fullname,
                    email,
                    password:hash
                  })
                  let token=generateToken(createdUser);
                  res.cookie("token",token);
                  res.redirect('/');
                }
              });
          });
        }
      } catch (error) {
        console.log(error.message);
      }
}

module.exports.loginUser=async function(req,res){
    try {
        let {email,password}=req.body;
        let user=await usermodel.findOne({email:email});
        if(!user){
          req.flash("error", "Email or Password is incorrect");
          return res.redirect("/");
        }
        else{
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    let token=generateToken(user)
                    res.cookie('token',token);
                    // res.status(200).send("Login Successful!");
                    res.redirect('/shop');
                    }
                else{
                  req.flash("error", "Email or Password is incorrect");
                  return res.redirect("/");
                    }
            })
        }
    } catch (error) {
        console.log(error.message);
    }    
}

module.exports.logoutUser=function(req,res){
    res.cookie('token',"");
    res.redirect('/');
}
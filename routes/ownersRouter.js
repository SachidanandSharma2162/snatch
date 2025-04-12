const express = require('express');
const app=express();
const router =express.Router();
const ownermodel=require('../models/ownermodel');
const { logoutUser } = require('../controllers/authController');
const productmodel = require('../models/productmodel');
const usermodel = require('../models/usermodel');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const { generateToken } = require('../utils/generateToken');
if(process.env.NODE_ENV === 'development'){
    router.post('/create',async(req,res)=>{
    let {fullname, email,password}=req.body;
    let owner=await ownermodel.find()
    if(owner.length>0){
      res.status(400).send('Owner already exists for this product.');
    }
    else{
      bcrypt.genSalt(12, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
          let createdOwner= await ownermodel.create({
            fullname,
            email,
            password:hash
          });
          let token=generateToken(createdOwner);
          res.cookie("token",token);
          res.redirect('/');
          res.send(createdOwner);
        });
    });
    }
  })
}
// console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
router.get("/admin/login",(req,res)=>{
  let error=req.flash('error');
    res.render('adminlogin',{error,loggedin:false})
})

// Handle login POST
router.post('/admin/owners/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const owner = await ownermodel.findOne({ email:email }).populate([
          { path: "orders.product" },
          { path: "orders.user" }
        ]);
        console.log(owner);
        
        if (!owner) {
           req.flash("error",'Invalid email or password')
            return res.redirect('/owners/admin/login');
        }
        else{
          bcrypt.compare(password,owner.password,(err,result)=>{
            if(result){
                let token=generateToken(owner)
                res.cookie('token',token);
                res.redirect('/owners/admin');
                }
            else{
              req.flash("error", "Email or Password is incorrect");
              return res.redirect("/owners/admin/login");
                }
        })
        }
    } catch (err) {
        console.error(err);
        req.flash("error",'Something went wrong')
        res.redirect('/owners/admin/owners/login');
    }
});
router.post('/:productid/delete', async (req, res) => {
  try {
    await productmodel.findByIdAndDelete(req.params.productid);
    res.redirect('/owners/admin');
  } catch (err) {
    req.flash("error","Error deleting product")
    res.redirect('/owners/admin');;
  }
});
router.get("/users/logout",logoutUser);
router.get('/admin',async (req,res)=>{
  try {
    const users = await usermodel.find();
    const products = await productmodel.find();
    let success=req.flash("success")
    let error=req.flash("error")
    res.render('admindashboard', { users,products,adminloggedin:false,success,error});
  } catch (err) {
    res.send("Error fetching products");
  }
})

router.get('/users/:id',async (req,res)=>{
  try {
    let user=await usermodel.findOne({_id:req.params.id});
    res.render("userprofile",{user});
  } catch (error) {
    req.flash("error",err.message)
  }
})
module.exports=router;
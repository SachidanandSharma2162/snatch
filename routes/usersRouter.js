const express = require('express');
const router =express.Router();
const {registerUser, loginUser,logoutUser}=require('../controllers/authController');
const isLoggedIn = require('../middlewares/isLoggedIn');
const usermodel = require('../models/usermodel');
const ownermodel = require('../models/ownermodel');
router.get('/',(req,res)=>{
  res.send('Hello from user route');
})
router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/logout',logoutUser);
router.get('/checkout',isLoggedIn,async (req,res)=>{
  let user=await usermodel.findOne({email:req.user.email}).populate("cart.product");
  res.render("checkout",{user});
});
router.post('/placeorder',isLoggedIn,async (req,res)=>{
  try {
    const user = await usermodel.findOne({email:req.user.email}).populate('cart.product');
    if (!user || user.cart.length === 0){
      req.flash("error","Your Cart is empty");
       return res.redirect('/cart');
      }

    for (const item of user.cart) {
      // Update user orders
      user.orders.push({
        product: item.product._id,
        count: item.count
      });

      // Find owner(s) of this product and update their order list
      const owners = await ownermodel.find({ products: item.product._id });
      for (const owner of owners) {
        owner.orders.push({
          product: item.product._id,
          user: user._id,
          count: item.count
        });
        await owner.save();
      }
    }

    user.cart = []; // Clear the cart
    await user.save();

    res.redirect('/cart'); // or /orders or confirmation page
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong.');
  }
})
module.exports=router;
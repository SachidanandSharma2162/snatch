const express=require('express');
const router=express.Router();
const productmodel=require('../models/productmodel')
const isLoggedIn=require('../middlewares/isLoggedIn');
const usermodel = require('../models/usermodel');
const upload = require('../config/multerconfig');

router.get('/',(req,res)=>{
    let error=req.flash("error");
    res.render("index",{ error, loggedin:false});
})
router.get('/shop',isLoggedIn,async (req,res)=>{
    let products=await productmodel.find();
    let success=req.flash("success");
    res.render('shop',{success, products});
})
router.get('/cart',isLoggedIn,async (req,res)=>{
  try {
    let user=await usermodel.findOne({email:req.user.email}).populate("cart.product");
    let bill = 0;
user.cart.forEach((item) => {
  bill += (Number(item.product.price) + 20 - Number(item.product.discount)) * item.count;
});
    let success=req.flash("success");
    let error=req.flash("error");
    // const bill = (Number(user.cart[0].price)+20 - Number(user.cart[0].discount))
    res.render("cart",{user,bill,success,error});
    
  } catch (error) {
    req.flash("error",error.message);
  }
})


router.get('/account', isLoggedIn, async (req, res) => {
    try {
      const user = await usermodel.findOne({ email: req.user.email });
  
      const userReviews = await productmodel.find({ "review.user": user._id })
        .select("name review")
        .lean();
        console.log(userReviews);
        
      const reviews = [];
      userReviews.forEach(product => {
        product.review.forEach(r => {
          if (r.user.toString() === user._id.toString()) {
            reviews.push({ product, text: r.text , reviewid: r._id});
          }
        });
      });
  
      res.render('account', { user, userReviews: reviews });
    } catch (err) {
      console.error("Error loading account:", err);
      res.status(500).send("Something went wrong");
    }
  });
  

router.get('/editprofile',isLoggedIn,async (req,res)=>{
    let user=await usermodel.findOne({email:req.user.email});
    res.render("editprofile",{user})
})
router.post('/editprofile', upload.single("image"), isLoggedIn, async (req, res) => {
  let user = await usermodel.findOne({ email: req.user.email });

  // Update contact
  user.contact = req.body.contact;

  // Update profile picture if file is uploaded
  if (req.file) {
    user.picture.data = req.file.buffer;
    user.picture.contentType = req.file.mimetype;
  }

  // Update address
  user.address = {
    housenumber: req.body.housenumber,
    area: req.body.area,
    nearyby: req.body.nearyby,
    state: req.body.state,
    country: req.body.country,
    pincode: req.body.pincode
  };

  await user.save();
  res.redirect('/account');
});

  router.get('/addtocart/:id', isLoggedIn, async (req, res) => {
    try {
      let user = await usermodel.findOne({ email: req.user.email });
      // Check if product is already in cart
      let existingItem = user.cart.find(item => item.product.toString() === req.params.id);
  
      if (existingItem) {
        // If product exists, increase count
        existingItem.count += 1;
      } else {
        // Else push new item to cart
        user.cart.push({
          product: req.params.id,
          count: 1
        });
      }
  
      await user.save();
      req.flash("success", "Added to cart");
      res.redirect("/shop");
  
    } catch (err) {
      console.error("Error adding to cart:", err);
      req.flash("error", "Could not add to cart");
      res.redirect("/shop");
    }
  });
    

module.exports=router;
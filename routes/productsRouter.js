const express = require('express');
const router =express.Router();
const upload = require('../config/multerconfig');
const productmodel=require('../models/productmodel');
const isLoggedIn = require('../middlewares/isLoggedIn');
const usermodel = require('../models/usermodel');
const {logoutUser}=require('../controllers/authController')

router.post('/create',upload.single("image"),async (req,res)=>{
  try {
    let{name,price,discount,bgcolor,panelcolor,textcolor}=req.body;
    let product=await productmodel.create({
      name,
      price,
      discount,
      textcolor,
      panelcolor,
      bgcolor,
      image:{
        data:req.file.buffer,
        contentType:req.file.mimetype
      }
      
    });
    req.flash("success", "Product created successfully");
    res.redirect("/owners/admin");
  } catch (error) {
    res.send(error.message)
  }
})
router.get('/detail/users/logout',logoutUser)
router.get("/detail/:id",isLoggedIn,async(req,res)=>{
  const user = await usermodel.findOne({ email: req.user.email });
  let product=await productmodel.findOne({_id:req.params.id}).populate("review.user");
  // console.log(product);
  let success=req.flash("success");
  let error=req.flash("error")
  res.render("productdetail",{user,product,success,error});
})

// Route: POST /:id/review
router.post('/:id/review', isLoggedIn, async (req, res) => {
  try {
    const { review } = req.body;
    const product = await productmodel.findById(req.params.id);
    const user = await usermodel.findOne({ email: req.user.email });

    if (!product || !user) {
      req.flash("error", "Product or user not found");
      return res.redirect("/");
    }

    // Push the review into the product's review array
    product.review.push({
      user: user._id,
      text: review
    });

    await product.save();
    req.flash("success", "Review added successfully!");

    res.redirect(`/products/detail/${req.params.id}`);
  } catch (err) {
    console.error("Error adding review:", err);
    req.flash("error", "Something went wrong");
    res.redirect(`/products/detail/${req.params.id}`);
  }
});

router.get('/deletereview/:productid/:reviewid', isLoggedIn, async (req, res) => {
  try {
    const { productid, reviewid } = req.params;

    // Find the product
    const product = await productmodel.findById(productid);
    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/shop");
    }

    // Find the specific review
    const review = product.review.id(reviewid);

    // Check if the review exists and belongs to the logged-in user
    if (!review || review.user.toString() !== req.user._id.toString()) {
      req.flash("error", "You can only delete your own reviews");
      return res.redirect(`/products/detail/${productid}`);
    }

    // Remove the review
    review.remove();
    await product.save();

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/products/detail/${productid}`);
  } catch (err) {
    console.error("Error deleting review:", err);
    req.flash("error", "Could not delete review");
    res.redirect(`/products/detail/${productid}`);
  }
});


router.get('/deleteitem/:itemid', isLoggedIn, async (req, res) => {
  try {
    const itemid = req.params.itemid;
    const user = await usermodel.findOne({ email: req.user.email });

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/cart");
    }

    // Filter out the item from cart by matching product._id
    user.cart = user.cart.filter(item => item.product.toString() !== itemid);

    await user.save();

    req.flash("success", "Item deleted from cart successfully!");
    res.redirect("/cart");
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    req.flash("error", "Failed to delete item from cart");
    res.redirect("/cart");
  }
});

router.get('/cart/update/:itemid/:action', isLoggedIn, async (req, res) => {
  try {
    const { itemid, action } = req.params;
    const user = await usermodel.findOne({ email: req.user.email });

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/cart");
    }

    const cartItem = user.cart.find(item => item.product.toString() === itemid);

    if (!cartItem) {
      req.flash("error", "Item not found in cart");
      return res.redirect("/cart");
    }

    if (action === 'increment') {
      cartItem.count += 1;
      req.flash("success", "Item quantity increased");
    } else if (action === 'decrement') {
      if (cartItem.count > 1) {
        cartItem.count -= 1;
        req.flash("success", "Item quantity decreased");
      } else {
        req.flash("error", "Minimum quantity is 1");
      }
    } else {
      req.flash("error", "Invalid action");
    }

    await user.save();
    res.redirect("/cart");
  } catch (error) {
    console.error("Cart update error:", error);
    req.flash("error", "Something went wrong while updating the cart");
    res.redirect("/cart");
  }
});

module.exports=router;
const express = require('express');
const router =express.Router();
const ownermodel=require('../models/ownermodel');
const { logoutUser } = require('../controllers/authController');
const productmodel = require('../models/productmodel');
const usermodel = require('../models/usermodel');
if(process.env.NODE_ENV === 'development'){
    router.post('/create',async(req,res)=>{
    let owner=await ownermodel.find()
    if(owner.length>0){
      res.status(400).send('Owner already exists for this product.');
    }
    else{
      let {fullname, email,password}=req.body;
      let createdOwner= await ownermodel.create({
        fullname,
        email,
        password
      });
      res.send(createdOwner);
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
        const owner = await ownermodel.findOne({ email:email });

        if (!owner || owner.password !== password) {
           req.flash("error",'Invalid email or password')
            return res.redirect('/owners/admin/owners/login');
        }
        // Redirect to dashboard
        req.flash('success',"Login")
        res.redirect('/owners/admin');
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


module.exports=router;
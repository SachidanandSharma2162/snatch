const cookieParser = require("cookie-parser");
const express=require("express");
const app= express();
const path= require("path");
const bcrypt= require("bcrypt");
const jwt=require('jsonwebtoken');
const db=require('./config/mongoose-connection');
const usersRouter=require('./routes/usersRouter')
const ownersRouter=require('./routes/ownersRouter')
const productsRouter=require('./routes/productsRouter')
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser());
app.use('/owners',ownersRouter);
app.use('/users',usersRouter);
app.use('/products',productsRouter);

app.get('/',(req,res)=>{
    res.render('index');
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
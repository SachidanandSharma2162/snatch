const express=require("express");
const app= express();

app.set('view engine', 'ejs');

const path= require("path");
const bcrypt= require("bcrypt");
const jwt=require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const expressSession=require('express-session');
const flash=require('connect-flash');
const db=require('./config/mongoose-connection');
const usersRouter=require('./routes/usersRouter')
const ownersRouter=require('./routes/ownersRouter')
const productsRouter=require('./routes/productsRouter')
const indexRouter=require('./routes/index')
require('dotenv').config();
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.EXPRESS_SESSION_SECRET,
}))
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser());
app.use('/',indexRouter)
app.use('/owners',ownersRouter);
app.use('/users',usersRouter);
app.use('/products',productsRouter);


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})
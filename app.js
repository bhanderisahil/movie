const express = require('express');
const app = express();
const port = 7000;
const path = require('path');
const ejs = require('ejs');
const cookieParser = require('cookie-parser')
const multer  = require('multer')

const adminrouter = require("./router/adminrouter")
const userrouter = require("./router/userrouter")
// require("./config/mongoose")
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://bhanderisahil:sahil%40123@cluster0.vttnglj.mongodb.net/movie",{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=>{
    console.log("coonection successful");
}).catch((err)=>{
    console.log("connection failed",err);
})


app.set('views',path.join(__dirname,'views')); 
app.set('view engine', 'ejs');


app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use("/upload",express.static(__dirname+"/upload"));

app.use(express.json());  

app.use(adminrouter);
app.use(userrouter);
app.listen(port,()=>{
    console.log(`server listening on ${port}`);
})
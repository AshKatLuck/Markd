const express=require('express');
const mongoose=require('mongoose');
const path=require("path");
const enjineMate=require("ejs-mate")

const app=express();


//set ejs engine
app.use("ejs", enjineMate);
//set views directory
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"))

//connect to the database
const dburl="mongodb://127.0.0.1:27017/markd";
mongoose
  .connect(dburl)
  .then(() => {
    console.log("MONGODB CONNECTION DONE");
  })
  .catch((err) => {
    console.log("MONGODB ERROR!!");
    console.error(err);
  });

  app.get('/',(req,res)=>{
    res.render("home");
  })

  app.listen(3000, ()=>{
    console.log("listening at port 3000")
  })
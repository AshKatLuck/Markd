const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const enjineMate = require("ejs-mate");
const methodOverride = require("method-override");
const Location = require("./models/location");

const app = express();

//set ejs engine
app.use("ejs", enjineMate);
//set views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//for getting form data from forms
app.use(express.urlencoded({ extended: true }));
//for delete and patch routes
app.use(methodOverride("_method"));

//connect to the database
const dburl = "mongodb://127.0.0.1:27017/markd";
mongoose
  .connect(dburl)
  .then(() => {
    console.log("MONGODB CONNECTION DONE");
  })
  .catch((err) => {
    console.log("MONGODB ERROR!!");
    console.error(err);
  });

//location routes
app.get("/location", (req, res) => {
  res.render("location/location.ejs");
});

app.get("/location/new", (req, res) => {
  res.render("location/new");
});

app.post("/location", async (req, res) => {
  const location = new Location(req.body.location);
  console.log(location.hasTravelled);
  if (location.hasTravelled) {
    location.hasTravelled = true;
  } else {
    location.hasTravelled = false;
  }
  res.send(location);
  //   const r = await location.save();
  //   res.send(r);
});

app.get("/location/edit/:id", (req, res) => {
  res.render("location/edit");
});
app.get("/location/:id", (req, res) => {
  const { id } = req.params;
  res.render("location/show");
});

//homepage route
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("listening at port 3000");
});

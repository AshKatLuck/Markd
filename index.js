const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const enjineMate = require("ejs-mate");
const methodOverride = require("method-override");
const Location = require("./models/location");
const { dateForHTMLForm, convertToZ } = require("./utils/dateFunctions.js");

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

app.use(express.static("public"));

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
app.get("/locations", async (req, res) => {
  const locations = await Location.find({});
  res.render("locations/index", { locations });
});

app.get("/locations/new", (req, res) => {
  res.render("locations/new");
});

app.post("/locations", async (req, res) => {
  const location = new Location(req.body.location);

  if (location.hasTravelled) {
    location.hasTravelled = true;
  } else {
    location.hasTravelled = false;
  }
  const date = new Date(location.dateOfVisit);
  const modifiedDate = convertToZ(date);
  location.dateOfVisit = modifiedDate;

  const r = await location.save();
  res.redirect(`/locations/${r._id}`);
});

app.get("/locations/:id/edit", async (req, res) => {
  const { id } = req.params;
  const location = await Location.findById(id);
  const dateInHTMLFormat = dateForHTMLForm(location.dateOfVisit);
  res.render("locations/edit", { location, dateInHTMLFormat });
});

app.patch("/locations/:id", async (req, res) => {
  const { id } = req.params;
  const editLocation = req.body.location;
  if (editLocation.hasTravelled) {
    editLocation.hasTravelled = true;
  } else {
    editLocation.hasTravelled = false;
  }
  const date = new Date(editLocation.dateOfVisit);
  const modifiedDate = convertToZ(date);
  //   console.log("date:", date);
  //   console.log("modifiedDate:", modifiedDate);
  editLocation.dateOfVisit = modifiedDate;
  //   console.log("editLocation", editLocation);

  const location = await Location.findByIdAndUpdate(
    { _id: id },
    { ...editLocation },
    { runValidators: true }
  );
  //   console.log("location", location);
  res.redirect(`/locations/${location._id}`);
});

app.delete("/locations/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Location.findByIdAndDelete({ _id: id });
  //   console.log(result);
  res.redirect("/locations");
});

app.get("/locations/:id", async (req, res) => {
  const { id } = req.params;
  const location = await Location.findById(id);
  //   const date = new Date(location.dateOfVisit);
  //   const offset = date.getTimezoneOffset();
  //   const dateToDisplay = date + offset;
  //   console.log(dateToDisplay);
  res.render("locations/show", { location });
});

//homepage route
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("listening at port 3000");
});

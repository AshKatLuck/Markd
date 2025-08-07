const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const enjineMate = require("ejs-mate");
const methodOverride = require("method-override");
const Location = require("./models/location");
const Landmark = require("./models/landmark.js");
const { dateForHTMLForm, convertToZ } = require("./utils/dateFunctions.js");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const { locationJoiSchema } = require("./utils/joiValidationSchema.js");

const app = express();

//set ejs engine
app.engine("ejs", enjineMate);
//set views directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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

//joi validation
const validateLocation = (req, res, next) => {
  const { error } = locationJoiSchema.validate(req.body.location);
  if (error) {
    const msgs = error.details.map((el) => el.message);
    return next(new ExpressError(msgs, 400));
  } else {
    next();
  }
};

//location routes
app.get(
  "/locations",
  catchAsync(async (req, res, next) => {
    const locations = await Location.find({});
    if (!locations) {
      return next();
    }
    res.render("locations/index", { locations });
  })
);

app.get("/locations/new", (req, res) => {
  res.render("locations/new");
});

app.post(
  "/locations",
  validateLocation,
  catchAsync(async (req, res, next) => {
    const location = new Location(req.body.location);

    if (location.hasTravelled) {
      location.hasTravelled = true;
    } else {
      location.hasTravelled = false;
    }

    const date = new Date(location.dateOfVisit);
    const modifiedDate = convertToZ(date);
    location.dateOfVisit = modifiedDate;
    console.log(location.dateOfVisit);
    console.log(req.body.location.dateOfVisit);

    const r = await location.save();
    res.redirect(`/locations/${r._id}`);
  })
);

app.get(
  "/locations/:id/edit",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const location = await Location.findById(id);
    if (!location) {
      return next();
    }
    const dateInHTMLFormat = dateForHTMLForm(location.dateOfVisit);
    res.render("locations/edit", { location, dateInHTMLFormat });
  })
);
//landmarks route
app.post(
  "/locations/:id/landmarks",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const landmark = new Landmark({ name: name, location: id });
    // console.log(landmark);
    const result = await landmark.save();
    console.log("result", result);
    res.redirect(`/locations/${id}`);
  })
);

app.delete(
  "/locations/:id/landmarks/:landmarkId",
  catchAsync(async (req, res, next) => {
    const { id, landmarkId } = req.params;
    const result = await Landmark.findByIdAndDelete({ _id: landmarkId });
    // console.log(result);
    res.redirect(`/locations/${id}`);
  })
);

app.patch(
  "/locations/:id",
  validateLocation,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const editLocation = req.body.location;
    if (editLocation.hasTravelled) {
      editLocation.hasTravelled = true;
    } else {
      editLocation.hasTravelled = false;
    }
    const date = new Date(editLocation.dateOfVisit);
    const modifiedDate = convertToZ(date);
    editLocation.dateOfVisit = modifiedDate;
    const location = await Location.findByIdAndUpdate(
      { _id: id },
      { ...editLocation },
      { runValidators: true }
    );
    if (!location) {
      return next();
    }
    res.redirect(`/locations/${location._id}`);
  })
);

app.delete(
  "/locations/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const landmarksdeleted = await Landmark.deleteMany({ location: id });
    // console.log("landmarks deleted", landmarksdeleted);
    const result = await Location.findByIdAndDelete({ _id: id });
    if (!result) {
      return next();
    }
    //   console.log(result);
    res.redirect("/locations");
  })
);

app.get(
  "/locations/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const landmarks = await Landmark.find({ location: id });
    // console.log("landmarks", landmarks);
    const location = await Location.findById(id);
    if (!location) {
      return next();
    }
    res.render("locations/show", { location, landmarks });
  })
);

//homepage route
app.get("/", (req, res) => {
  res.render("home");
});

app.all(/(.*)/, (req, res, next) => {
  // console.log("in app.all");
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  // console.log("last app.use error handler");
  // console.log(err);
  const { statusCode = 500, message } = err;
  if (!err.message) {
    err.message = "Something Went Wrong!";
  }
  // console.log(err.message, err.statusCode);
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("listening at port 3000");
});

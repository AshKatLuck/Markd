const express = require("express");
const router = express.Router();
const Location = require("../models/location");
const Landmark = require("../models/landmark");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { locationJoiSchema } = require("../utils/joiValidationSchema");
const { dateForHTMLForm, convertToZ } = require("../utils/dateFunctions");
const { isLoggedIn } = require("../middleware");

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

router
  .route("/")
  .get(
    catchAsync(async (req, res, next) => {
      const locations = await Location.find({});
      if (!locations) {
        req.flash("error", "No locations found");
        return next();
      }
      res.render("locations/index", { locations });
    })
  )
  .post(
    isLoggedIn,
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
      req.flash("success", "location added succesfully!");
      res.redirect(`/locations/${r._id}`);
    })
  );

router.route("/new").get(isLoggedIn, (req, res) => {
  res.render("locations/new");
});

router
  .route("/:id")
  .get(
    catchAsync(async (req, res, next) => {
      const { id } = req.params;
      const landmarks = await Landmark.find({ location: id });
      // console.log("landmarks", landmarks);
      const location = await Location.findById(id);
      if (!location) {
        req.flash("error", "Location not found");
        return next();
      }
      res.render("locations/show", { location, landmarks });
    })
  )
  .delete(
    isLoggedIn,
    catchAsync(async (req, res, next) => {
      const { id } = req.params;
      const landmarksdeleted = await Landmark.deleteMany({ location: id });
      // console.log("landmarks deleted", landmarksdeleted);
      const result = await Location.findByIdAndDelete({ _id: id });
      if (!result) {
        req.flash("error", "Location not found");
        return next();
      }
      req.flash("deletion", `successfully deleted the location!`);
      res.redirect("/locations");
    })
  )
  .patch(
    isLoggedIn,
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
        req.flash("error", "Location not found");
        return next();
      }
      req.flash("success", `succesfully updated ${location.title}!`);
      res.redirect(`/locations/${location._id}`);
    })
  );

router.route("/:id/edit").get(
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const location = await Location.findById(id);
    if (!location) {
      req.flash("error", "Location not found");
      return next();
    }
    const dateInHTMLFormat = dateForHTMLForm(location.dateOfVisit);
    res.render("locations/edit", { location, dateInHTMLFormat });
  })
);

module.exports = router;

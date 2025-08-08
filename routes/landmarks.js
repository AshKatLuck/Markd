const express = require("express");
const router = express.Router();
const Landmark = require("../models/landmark");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware");

router.route("/:id/landmarks").post(
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const landmark = new Landmark({ name: name, location: id });
    // console.log(landmark);
    const result = await landmark.save();
    // console.log("result", result);
    req.flash("success", `succesfully added ${landmark.name} to the location!`);
    res.redirect(`/locations/${id}`);
  })
);

router.route("/:id/landmarks/:landmarkId").delete(
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id, landmarkId } = req.params;
    const result = await Landmark.findByIdAndDelete({ _id: landmarkId });
    if (!result) {
      req.flash("error", "Landmark not found");
      return next();
    }
    // console.log(result);
    req.flash("deletion", `succesfully deleted the landmark!`);
    res.redirect(`/locations/${id}`);
  })
);

module.exports = router;

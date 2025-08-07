const express = require("express");
const router = express.Router();
const Landmark = require("../models/landmark");
const catchAsync = require("../utils/catchAsync");

router.route("/:id/landmarks").post(
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const landmark = new Landmark({ name: name, location: id });
    // console.log(landmark);
    const result = await landmark.save();
    // console.log("result", result);
    res.redirect(`/locations/${id}`);
  })
);

router.route("/:id/landmarks/:landmarkId").delete(
  catchAsync(async (req, res, next) => {
    const { id, landmarkId } = req.params;
    const result = await Landmark.findByIdAndDelete({ _id: landmarkId });
    // console.log(result);
    res.redirect(`/locations/${id}`);
  })
);

module.exports = router;

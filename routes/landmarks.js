const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor } = require("../middleware");
const landmark = require("../controllers/landmarks");

router
  .route("/:id/landmarks")
  .post(isLoggedIn, isAuthor, catchAsync(landmark.createLandmark));

router
  .route("/:id/landmarks/:landmarkId")
  .delete(isLoggedIn, isAuthor, catchAsync(landmark.deleteLandmark));

module.exports = router;

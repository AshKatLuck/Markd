const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateLocation } = require("../middleware");
const locations = require("../controllers/locations");

router
  .route("/")
  .get(isLoggedIn, catchAsync(locations.showLocations))
  .post(isLoggedIn, validateLocation, catchAsync(locations.createLocation));

router.route("/new").get(isLoggedIn, locations.renderNewLocationForm);

router
  .route("/:id")
  .get(isLoggedIn, isAuthor, catchAsync(locations.showLocation))
  .delete(isLoggedIn, isAuthor, catchAsync(locations.deleteLocation))
  .patch(
    isLoggedIn,
    isAuthor,
    validateLocation,
    catchAsync(locations.editLocation)
  );

router
  .route("/:id/edit")
  .get(isLoggedIn, isAuthor, catchAsync(locations.renderEditLocationForm));

module.exports = router;

const Location = require("../models/location");
const Landmark = require("../models/landmark");
const { dateForHTMLForm, convertToZ } = require("../utils/dateFunctions");
const ExpressError = require("../utils/ExpressError");

const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken=process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.showLocations = async (req, res, next) => {
  const user = res.locals.currentUser;
  // console.log(user);
  const locations = await Location.find({ userId: user._id });
  if (!locations) {
    req.flash("error", "No locations found");
    return next();
  }
  res.render("locations/index", { locations });
};

module.exports.createLocation = async (req, res, next) => {
  let userId = res.locals.currentUser._id;
  const location = new Location(req.body.location);
  location.userId = userId;

  if (location.hasTravelled) {
    location.hasTravelled = true;
  } else {
    location.hasTravelled = false;
  }
  const date = new Date(location.dateOfVisit);
  const modifiedDate = convertToZ(date);
  location.dateOfVisit = modifiedDate;
  location.userId = res.locals.currentUser._id;
  const queryLocation=`${location.city},${location.state},${location.country}`;
  const geodata=await geocoder.forwardGeocode({
    query:queryLocation,
    limit:1
  }).send();
  location.geometry=geodata.body.features[0].geometry;
  // console.log(geodata.body.features[0].center)
  // res.send(JSON.stringify(geodata.body.features[0].center))
  const r = await location.save();
  req.flash("success", "location added succesfully!");
  res.redirect(`/locations/${r._id}`);
};

module.exports.renderNewLocationForm = (req, res) => {
  res.render("locations/new");
};

module.exports.showLocation = async (req, res, next) => {
  const { id } = req.params;
  const location = await Location.findById(id);
  // const flag =
  //   JSON.stringify(location.userId) ===
  //   JSON.stringify(res.locals.currentUser._id);
  // if (!flag) {
  //   req.flash("error", "Access denied");
  //   return next(new ExpressError("Access denied", 403));
  // }
  const landmarks = await Landmark.find({ location: id });
  // console.log("landmarks", landmarks);

  // console.log("flag", flag);
  // console.log("location.userId", JSON.stringify(location.userId));
  // console.log(
  //   "res.locals.currentUser._id",
  //   JSON.stringify(res.locals.currentUser._id)
  // );

  if (!location) {
    req.flash("error", "Location not found");
    return next();
  }
  res.render("locations/show", { location, landmarks });
};

module.exports.deleteLocation = async (req, res, next) => {
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
};

module.exports.editLocation = async (req, res, next) => {
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
};

module.exports.renderEditLocationForm = async (req, res, next) => {
  const { id } = req.params;

  const location = await Location.findById(id);
  if (!location) {
    req.flash("error", "Location not found");
    return next();
  }
  const dateInHTMLFormat = dateForHTMLForm(location.dateOfVisit);
  res.render("locations/edit", { location, dateInHTMLFormat });
};

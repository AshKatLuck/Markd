const Location = require("./models/location");
const ExpressError = require("./utils/ExpressError");
const { locationJoiSchema } = require("./utils/joiValidationSchema");

module.exports.isLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    // console.log(req.originalUrl, req.session.returnTo);
    req.flash("error", "You must be signed in");
    res.redirect("/login");
  } else {
    // console.log("user is", req.user);
    next();
  }
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    // console.log("storeReturnTo,", req.session.returnTo);
    const originalPath = req.session.returnTo;
    const path = originalPath.replace("/landmarks", "");
    res.locals.returnTo = path;
    // console.log("path:", path);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const location = await Location.findById(id);
  const flag =
    JSON.stringify(location.userId) ===
    JSON.stringify(res.locals.currentUser._id);
  if (!flag) {
    res.locals.returnTo = "/login";
    req.flash("error", "Access denied");
    return next(new ExpressError("Access denied", 403));
  }
  next();
};

//joi validation
module.exports.validateLocation = (req, res, next) => {
  const location = req.body.location;
  console.log("location from validateLocation:",location)
  const userId = res.locals.currentUser._id.toString();
  location.userId = userId;
  const { error } = locationJoiSchema.validate(location);
  if (error) {
    const msgs = error.details.map((el) => el.message);
    return next(new ExpressError(msgs, 400));
  } else {
    next();
  }
};

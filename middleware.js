module.exports.isLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    console.log(req.originalUrl, req.session.returnTo);
    req.flash("error", "You must be signed in");
    res.redirect("/login");
  } else {
    console.log("user is", req.user);
    next();
  }
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    console.log("storeReturnTo,", req.session.returnTo);
    const originalPath = req.session.returnTo;
    const path = originalPath.replace("/landmarks", "");
    res.locals.returnTo = path;
    console.log("path:", path);
  }
  next();
};

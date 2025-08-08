const User = require("../models/user");

module.exports.renderRegisterPage = (req, res, next) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { user } = req.body;
    const newUser = new User({
      username: user.username,
      email: user.email,
    });
    const addedUser = await User.register(newUser, user.password);
    req.login(addedUser, (err) => {
      if (err) {
        return next();
      }
      req.flash("success", "Registered successfully");
      res.redirect("/locations");
    });
  } catch (error) {
    req.flash("error", `${error.message}. Try again`);
    res.redirect("/register");
  }
};

module.exports.renderLoginPage = (req, res, next) => {
  res.render("users/login");
};

module.exports.login = (req, res, next) => {
  //   console.log("login post", res.locals.returnTo);
  const redirectUrl = res.locals.returnTo || "/locations";
  req.flash("success", "Welcome back");
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Bye bye bye");
    res.redirect("/");
  });
};

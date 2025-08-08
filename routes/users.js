const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { isLoggedIn, storeReturnTo } = require("../middleware");

router
  .route("/register")
  .get((req, res, next) => {
    res.render("users/register");
  })
  .post(
    catchAsync(async (req, res, next) => {
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
    })
  );

router
  .route("/login")
  .get((req, res, next) => {
    res.render("users/login");
  })
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    (req, res, next) => {
      console.log("login post", res.locals.returnTo);
      const redirectUrl = res.locals.returnTo || "/locations";
      req.flash("success", "Welcome back");
      res.redirect(redirectUrl);
    }
  );

router.route("/logout").get(isLoggedIn, (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Bye bye bye");
    res.redirect("/locations");
  });
});
module.exports = router;
// app.get("/fakeuser", async (req, res) => {
//   const user = new User({
//     username: "asha",
//     email: "asha@gmail.com",
//   });
//   const newUser = await User.register(user, "karthika");
//   res.send(newUser);
// });

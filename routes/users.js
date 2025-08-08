const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { isLoggedIn, storeReturnTo } = require("../middleware");
const Users = require("../controllers/users");

router
  .route("/register")
  .get(Users.renderRegisterPage)
  .post(catchAsync(Users.registerUser));

router
  .route("/login")
  .get(Users.renderLoginPage)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    Users.login
  );

router.route("/logout").get(isLoggedIn, Users.logout);
module.exports = router;

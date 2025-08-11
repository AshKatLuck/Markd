if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const enjineMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const locationRouter = require("./routes/locations.js");
const landmarkRouter = require("./routes/landmarks.js");
const userRouter = require("./routes/users.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require("connect-mongo");



const app = express();

//connect to the database
const dburl = "mongodb://127.0.0.1:27017/markd";

const store = MongoStore.create({
  mongoUrl: dburl,
  touchAfter: 24 * 60 * 60,
});

const sessionCofig = {
  store: store,
  name: "nonObviousName",
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 27 * 7,
  },
};

//set ejs engine
app.engine("ejs", enjineMate);
//set views directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//for getting form data from forms
app.use(express.urlencoded({ extended: true }));
//for delete and patch routes
app.use(methodOverride("_method"));

//declaring public directory
app.use(express.static("public"));

app.use(session(sessionCofig));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to set the success and error variables so that they are available to all pages
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.deletion = req.flash("deletion");
  res.locals.error = req.flash("error");
  next();
});

mongoose
  .connect(dburl)
  .then(() => {
    console.log("MONGODB CONNECTION DONE");
  })
  .catch((err) => {
    console.log("MONGODB ERROR!!");
    console.error(err);
  });



app.use("/locations", locationRouter);
app.use("/locations", landmarkRouter);
app.use("/", userRouter);



//homepage route
app.get("/", (req, res) => {
  res.render("home");
});

app.all(/(.*)/, (req, res, next) => {
  // console.log("in app.all");
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  // console.log("last app.use error handler");
  // console.log(err);
  const { statusCode = 500, message } = err;
  if (!err.message) {
    err.message = "Something Went Wrong!";
  }
  // console.log(err.message, err.statusCode);

  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("listening at port 3000");
});

const User = require("../models/user");
const Location=require("../models/location")

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

module.exports.selectLocations=async (req,res,next)=>{
  const user = res.locals.currentUser;
  const {selectPin}=req.body;
  if(selectPin=="both"){
    const locations=await Location.find({userId: user._id });
    res.render("locations/index",{locations})
  }else if(!selectPin){
    const locations=await Location.find({userId: user._id });
    res.render("locations/index",{locations})
  }else if(selectPin=="past"){
    const locations=await Location.find({hasTravelled:true,userId: user._id });
    res.render("locations/index",{locations})
  }else if(selectPin=="future"){
    const locations=await Location.find({hasTravelled:false,userId: user._id });
    res.render("locations/index",{locations})
  }  
}

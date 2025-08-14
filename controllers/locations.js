const Location = require("../models/location");
const Landmark = require("../models/landmark");
const { dateForHTMLForm, convertToZ } = require("../utils/dateFunctions");
const {cloudinary}=require("../cloudinary/index")

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
  const {imageUpload}=req.body;
  const location = new Location(req.body.location);
  location.userId = userId;
  // console.log(req.body.location);
  // console.log(location);
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

  // console.log(imageUpload);
  //for url upload
  if(imageUpload=="urlUpload"){  
    const url=req.body.location.picture;
    // console.log(url);
    location.picture=[{
      url:url,
      filename:location.title,
    }];
  }else if(imageUpload=="fileUpload"){
    location.picture = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  }
  // res.send(location); 
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
  const location=await Location.findById({_id:id});
  // console.log("inside deleteLocation:",location)
  for(let i=0;i<location.picture.length;i++){
    // console.log("inside for loop")
    const result=await cloudinary.search.expression(`public_id:${location.picture[i].filename}`).execute();
    // console.log("total count:$$$",result.total_count);
    if(result.total_count>0){
      const delStatus=await cloudinary.uploader.destroy(location.picture[i].filename);
      // console.log("delStatus:", delStatus);
    }    
  }
  const result = await Location.findByIdAndDelete({ _id: id });
  // console.log('result of deleting from locations table:',result);
  if (!result) {
    req.flash("error", "Location not found");
    return next();
  }
  req.flash("deletion", `successfully deleted the location!`);
  res.redirect("/locations");
};

module.exports.editLocation = async (req, res, next) => {
  // console.log("editLocations")
    const { id } = req.params;
    const originalLocation=await Location.findById({_id:id});
    // console.log("req.body :", req.body);
    const {imageUpload}=req.body;
    // console.log("imageUpload", imageUpload)
    // const pictures = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    const editLocation = req.body.location;
    // console.log("editLocation", editLocation)
    if (editLocation.hasTravelled) {
      editLocation.hasTravelled = true;
    } else {
      editLocation.hasTravelled = false;
    }
    const date = new Date(editLocation.dateOfVisit);
    const modifiedDate = convertToZ(date);
    editLocation.dateOfVisit = modifiedDate;
    editLocation.picture=originalLocation.picture;
    // console.log("original location", originalLocation);
    // console.log("editLocation:", editLocation);
    // console.log("req.body.deleteImages",req.body.deleteImages);
    // console.log("imageUploadRadio",imageUpload)
    const location = await Location.findByIdAndUpdate(
      { _id: id },
      { ...editLocation },
      { runValidators: true, new:true }      
    );

    const queryLocation=`${location.city},${location.state},${location.country}`;
    const geodata=await geocoder.forwardGeocode({
      query:queryLocation,
      limit:1
    }).send();
    location.geometry=geodata.body.features[0].geometry;
    // console.log("location after updation and geocoding", location)

    if(imageUpload=="urlUpload"){  
      const url=req.body.picture;
      // console.log(url);
      editLocation.picture=[{
        url:url,
        filename:`${editLocation.title}_${(Math.floor(Math.random()*1000))}`,
      }];
      // console.log(editLocation);
    }else if(imageUpload=="fileUpload"){
      editLocation.picture = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    // console.log(editLocation)
    }
    if(imageUpload){
      location.picture.push(...editLocation.picture);
    } 
    // console.log("location after adding new files",location);  
    await location.save();
    // // const imagesToDelete = req.body.deleteImages;
    // // console.log("images to delete",imagesToDelete)
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        const result1=await cloudinary.uploader.destroy(filename);
        // console.log("in cloudinary fopr loop result:", result1)        
      }
      const result2 = await location.updateOne({$pull: { picture: { filename: { $in: req.body.deleteImages } } }, });
      // console.log("Table updation results:", result2);
    }
    if (!location) {
      req.flash("error", "Location not found");
      return next();
    }
    req.flash("success", `succesfully updated ${location.title}!`);
    res.redirect(`/locations/${location._id}`);
    // res.send(location);
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
}

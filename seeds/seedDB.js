const mongoose = require("mongoose");
const Location = require("../models/location");
const Landmark = require("../models/landmark");
const { descriptors, places } = require("./seedHelpers");
const cities = require("./cities");

//connect to the database
const dburl = "mongodb://127.0.0.1:27017/markd";
mongoose
  .connect(dburl)
  .then(() => {
    console.log("MONGODB CONNECTION DONE");
  })
  .catch((err) => {
    console.log("MONGODB ERROR!!");
    console.error(err);
  });

function generateRandomDate(startDate, endDate) {
  // Get the timestamps (milliseconds since epoch) of the start and end dates
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();
  // Generate a random timestamp within the range
  // Math.random() returns a float between 0 (inclusive) and 1 (exclusive)
  const randomTimestamp =
    startTimestamp + Math.random() * (endTimestamp - startTimestamp);
  // Create a new Date object from the random timestamp
  return new Date(randomTimestamp);
}

function randomizer(array) {
  const randomNumber = Math.floor(Math.random() * array.length);
  return array[randomNumber];
}

const imageUrls = [
  "https://images.unsplash.com/photo-1567589602992-778bb34d417b?q=80&w=1033&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1589191702216-923536264808?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1708433275470-04e15698954c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1703437872595-4b571ddcf72d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1752774251393-c5324e43aace?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1731522931673-04fa7482792a?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1697730182658-8f469cafff71?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1598038748999-1174fb7d2562?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1694475061874-c3ed70a61e33?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1593054676350-b9335c3cea6e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1484271516638-5de1a7e7e5e8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const userIds = [
  "68962af22295c870803e5d59",
  "68962add2295c870803e5d52",
  "68962ac82295c870803e5d4b",
  "689523a8e1600ab25c60587c",
  "689522e60d6f82b06503a96b",
  "689519a1b79e0a8bf15b9703",
  "689517db5d308953976c8f98",
];

const seedDB = async (req, res) => {
  const start = new Date(2020, 0, 1);
  const end = new Date(2030, 12, 31);
  let hasTravelled = null;
  const r = await Location.deleteMany({});
  const s = await Landmark.deleteMany({});
  console.log(r);
  for (let i = 0; i < 50; i++) {
    const dateOfVisit = generateRandomDate(start, end);
    const today = new Date();
    let userId = randomizer(userIds);
    hasTravelled = dateOfVisit <= today ? true : false;
    let title = randomizer(descriptors) + " " + randomizer(places);
    let cityObject = randomizer(cities);
    let city = cityObject.city;
    let state = cityObject.state;
    let geometry={
      type:"Point",
      coordinates:[cityObject.longitude,cityObject.latitude]
    }
    // let lat = cityObject.latitude;
    // let long = cityObject.longitude;
    let country = "US";
    let description =
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est error dolores deserunt fugit, omnis dolore accusantium expedita nemo animi harum, esse obcaecati unde quisquam molestias optio,quas totam? Dicta, neque! Nihil, placeat adipisci laborum exercitationem libero atque similique! Porro sint eos voluptates sunt placeat repellat, assumenda quisquam. Voluptates aperiam eligendi temporibus at aliquam itaque, esse similique. Est sit beatae iste.";
    let rating = Math.floor(Math.random() * 5) + 1;
    let picture = randomizer(imageUrls);
    const location = {
      userId,
      hasTravelled,
      title,
      city,
      state,
      country,
      geometry,
      description,
      rating,
      picture,
      dateOfVisit,
    };

    const loc = new Location(location);
    const result = await Location.insertOne(loc);
    console.log(result);
  }
};

seedDB();

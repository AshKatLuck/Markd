const mongoose = require("mongoose");
const Location = require("../models/location");
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

const seedDB = async (req, res) => {
  const start = new Date(2020, 0, 1);
  const end = new Date(2030, 12, 31);
  let hasTravelled = null;
  const r = await Location.deleteMany({});
  console.log(r);
  for (let i = 0; i < 50; i++) {
    const dateOfVisit = generateRandomDate(start, end);
    const today = new Date();
    hasTravelled = dateOfVisit <= today ? true : false;
    let title = randomizer(descriptors) + " " + randomizer(places);
    let cityObject = randomizer(cities);
    let city = cityObject.city;
    let state = cityObject.state;
    let lat = cityObject.latitude;
    let long = cityObject.longitude;
    let country = "US";
    let description =
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est error dolores deserunt fugit, omnis dolore accusantium expedita nemo animi harum, esse obcaecati unde quisquam molestias optio,quas totam? Dicta, neque! Nihil, placeat adipisci laborum exercitationem libero atque similique! Porro sint eos voluptates sunt placeat repellat, assumenda quisquam. Voluptates aperiam eligendi temporibus at aliquam itaque, esse similique. Est sit beatae iste.";
    let rating = Math.floor(Math.random() * 5) + 1;
    const location = {
      hasTravelled,
      title,
      city,
      state,
      country,
      long,
      lat,
      description,
      rating,
      dateOfVisit,
    };

    const loc = new Location(location);
    const result = await Location.insertOne(loc);
    console.log(result);
  }
};

seedDB();

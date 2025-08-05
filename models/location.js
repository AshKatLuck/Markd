const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  hasTravelled: {
    type: Boolean,
  },
  title: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  dateOfVisit: Date,
  description: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  long: String,
  lat: String,
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;

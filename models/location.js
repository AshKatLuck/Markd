const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
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
  picture: {
    type: String,
  },
  dateOfVisit: Date,
  description: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  // long: String,
  // lat: String,
  geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;

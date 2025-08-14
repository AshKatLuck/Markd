const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/c_thumb,w_200,g_face");
});

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
  picture: [ImageSchema],

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

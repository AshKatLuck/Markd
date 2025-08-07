const { string, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LandmarkSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: "Location",
  },
});

const Landmark = mongoose.model("Landmark", LandmarkSchema);
module.exports = Landmark;

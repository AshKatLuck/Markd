const Joi = require("joi");

module.exports.locationJoiSchema = Joi.object({
  userId: Joi.string().required(),
  title: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  rating: Joi.number().required(),
  dateOfVisit: Joi.date().iso().required(),
  description: Joi.string(),
  hasTravelled: Joi.string(),
  picture:Joi.string().allow(""),  
}).required();

module.exports.landmarkJoiSchema = Joi.object({
  name: Joi.string().required(),
  // location: Joi.string(),
}).required();

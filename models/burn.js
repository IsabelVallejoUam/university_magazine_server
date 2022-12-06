const mongoose = require("mongoose");
const BurnSchema = mongoose.Schema({
  body_part: {type: String, require: true},
  ubication: {type: String, require: true},
  burn_degree: {type: Number, require: true},
  initial_pain_level: {type: Number, require: false},
  date: {type: Date, require: false},
  aspect: {type: String, require: false},
  photo: {type: String, require: false},
  active:{type: Boolean, require: true},
  user_id: {type: String, require: true},
});

module.exports = mongoose.model("Burn", BurnSchema);
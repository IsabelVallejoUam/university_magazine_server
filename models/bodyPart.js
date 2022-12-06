const mongoose = require("mongoose");
const bodyPartSchema = mongoose.Schema({
  name: {type: String, require: true},
  ubication: {type: String, require: false},
});

module.exports = mongoose.model("BodyPart", bodyPartSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiseaseSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  treatment: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Disease", DiseaseSchema);

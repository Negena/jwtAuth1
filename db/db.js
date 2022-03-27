const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    requried: true
  },
  email: {
    type: String,
    requried: true,
    trim: true,
    lowercase: true,
  }
})

const model = mongoose.model("validate", schema )

module.exports = model;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique : true,
  },
  password: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  email: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: new Date(),
  },
  OTP:{
    type:mongoose.SchemaTypes.Number,
    required:false,
  },
  OTP_EXP:{
    type:mongoose.SchemaTypes.Date,
    required:false,
  }
});

module.exports = mongoose.model("users", userSchema);

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  content: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  categorie: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
  completed: {
    type: mongoose.SchemaTypes.Boolean,
    required: false,
    default:false,
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("notes", noteSchema);

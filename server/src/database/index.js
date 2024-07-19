const mongoose = require("mongoose");
const env = require('dotenv')
env.config()
mongoose
  .connect(
    process.env.CONNECTION_STRING
  )
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((e) => {
    console.log(e);
  });

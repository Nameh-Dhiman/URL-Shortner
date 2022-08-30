const { Schema, model } = require("mongoose");

const URLSchema = new Schema({
  url: { type: String, unique: true },
  short: { type: String, unique: true },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: "10m" },
  },
  // will expire after 10min
});

const URLModel = new model("url", URLSchema);
module.exports = URLModel;

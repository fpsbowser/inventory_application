const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ManufactureSchema = new Schema({
  name: { type: String, required: true, maxLength: 30 },
  founded: { type: Date, required: true },
  founder: { type: String },
  headquarters: { type: String },
  description: { type: String },
});

ManufactureSchema.virtual("url").get(function () {
  return `/catalog/manufacture/${this._id}`;
});

module.exports = mongoose.model("Manufacture", ManufactureSchema);

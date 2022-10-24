const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const ManufactureSchema = new Schema({
  name: { type: String, required: true, maxLength: 30 },
  founded: { type: Date, required: true },
  founder: { type: String },
  headquarters: { type: String },
  description: { type: String },
});

ManufactureSchema.virtual("url").get(function () {
  return `/inventory/manufacture/${this._id}`;
});

ManufactureSchema.virtual("founded_formatted").get(function () {
  return DateTime.fromJSDate(this.founded).toISODate(); // format 'YYYY-MM-DD'
});

module.exports = mongoose.model("Manufacture", ManufactureSchema);

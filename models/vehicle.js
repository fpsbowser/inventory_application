const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
  model: { type: String, required: true, maxLength: 50 },
  make: { type: Schema.Types.ObjectId, ref: "Manufacture", required: true },
  price: { type: String, required: true },
  color: { type: String, required: true },
  miles: { type: Number, required: true },
  description: { type: String, required: true },
  type: [{ type: Schema.Types.ObjectId, ref: "Type", required: true }],
});

VehicleSchema.virtual("url").get(function () {
  return `/inventory/vehicle/${this._id}`;
});

module.exports = mongoose.model("Vehicle", VehicleSchema);

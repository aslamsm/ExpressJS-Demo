const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rate: Number,
    unit: { type: String, required: true },
    isTaxable: { type: Boolean, default: false },
    taxPercentage: Number,
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Item", itemSchema);

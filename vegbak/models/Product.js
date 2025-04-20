const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  pricePerQuintal: Number,
  availableQuantityInQuintals: Number,
  category: { type: String, enum: ["vegetable", "fruit"], default: "vegetable" },
});

module.exports = mongoose.model("Product", ProductSchema);

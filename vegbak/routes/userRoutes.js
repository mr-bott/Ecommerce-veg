const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const router = express.Router();

router.get("/products", async (req, res) => {
    try {
      const search = req.query.search || "";
      const regex = new RegExp(search, "i"); // case-insensitive
  
      const products = await Product.find({ name: { $regex: regex } });
      res.json(products);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch products", error: err.message });
    }
  });
  
  router.get("/products/:id", async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
  });
  
  router.get("/orders/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      const orders = await Order.find({ userId })
        .populate("userId", "name email")
        .populate(
          "products.productId",
          "name description pricePerQuintal availableQuantityInQuintals imageUrl"
        )
        .exec();
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
      }
  
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders for user:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  
  router.post("/orders", async (req, res) => {
    const { userId, products, totalAmount } = req.body;
    const order = new Order({ userId, products, totalAmount });
    await order.save();
    res.status(201).json({ message: "Order placed" });
  });
  
  router.get("/orders/:userId", async (req, res) => {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  });
  
  
module.exports = router;
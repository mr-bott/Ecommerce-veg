const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const router = express.Router();


router.get("/admin/orders/recent", async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentOrders = await Order.find({ createdAt: { $gte: last24Hours } })
      .populate("userId", "name email")
      .populate("products.productId", "name") // ✅ Include product name and price
      .sort({ createdAt: -1 }) // ✅ sort before exec
      .exec();
    res.json(recentOrders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ message: "Failed to fetch recent orders" });
  }
});

router.get("/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // Include user name and email
      .populate("products.productId", "name") // ✅ Include product name
      .exec();

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
router.get("/admin/orders/total-amount", async (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Aggregation for total sales and total orders
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const totalAmount = salesData[0]?.totalSales || 0;
    const totalOrders = salesData[0]?.totalOrders || 0;

    // Count of pending orders
    const pendingOrders = await Order.countDocuments({ status: "placed" });

    // Count of orders in last 24 hours
    const last24HoursOrders = await Order.countDocuments({
      createdAt: { $gte: last24Hours },
    });

    res.json({ totalAmount, totalOrders, pendingOrders, last24HoursOrders });
  } catch (error) {
    console.error("Error calculating order stats:", error);
    res.status(500).json({ message: "Failed to calculate order stats" });
  }
});

router.get("/admin/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("userId", "name email")
      .populate(
        "products.productId",
        "name description pricePerQuintal availableQuantityInQuintals imageUrl"
      )
      .exec();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ message: "Failed to fetch the order" });
  }
});

router.patch("/admin/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "Order status updated" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/admin/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

router.put("/admin/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // <- this returns the updated document
    );
    res.json(updatedProduct);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/admin/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: err.message });
  }
});


module.exports = router;
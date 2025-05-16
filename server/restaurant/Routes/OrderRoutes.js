const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/OrderController")

// Get all orders by restaurant ID
router.get("/:restaurantId", orderController.getOrdersByRestaurant);

// Update order status
router.put("/update-status/:id", orderController.updateOrderStatus);

module.exports = router;

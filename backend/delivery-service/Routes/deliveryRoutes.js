const express = require("express");
const router = express.Router();
const {
  getAssignedOrders,
  getDeliveryHistory,
  acceptOrder,
  updateOrderStatus,
  updateProfile,
  assignOrder,
} = require("./../Controllers/deliveryController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

// Internal route: auto-assign driver to order
router.post("/assign",verifyToken,assignOrder);

// Driver routes
// This route is used to fetch all assigned orders for a driver
router.get("/assigned",verifyToken,verifyRole("deliveryPerson"), getAssignedOrders);

// This route is used to fetch the delivery history of a driver
router.get("/history",verifyToken,verifyRole("deliveryPerson"),getDeliveryHistory);

// This route is used to accept an order by a driver
router.post("/accept/:orderId",verifyToken,verifyRole("deliveryPerson"),acceptOrder);

// This route is used to update the status of an order by a driver
router.put("/status/:orderId",verifyToken,verifyRole("deliveryPerson"),updateOrderStatus);

// This route is used to update the profile of a driver
router.put("/profile",verifyToken,verifyRole("deliveryPerson"),updateProfile);

module.exports = router;

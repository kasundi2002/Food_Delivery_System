const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/orderController");

// These routes are specifically for the delivery-service to call
router.post("/accept/:id", orderController.acceptOrder);
router.post("/update-status/:id", orderController.updateOrderStatus);
router.get("/history", orderController.getDeliveryHistory);
router.get("/", orderController.getAllOrders);
router.get("/unassigned", orderController.getUnassignedOrders);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getAssignedOrders,
  acceptOrder,
  updateStatus,
  getDeliveryHistory,
  updateProfile,
  getAllOrders,
  assignOrder,
} = require("../controllers/deliveryPersonController");
const checkActiveDeliveryPerson = require("../middleware/checkActiveDeliveryPerson");
const verifyJWT = require("../Middleware/checkJWT.JS");

//delivery service
router.get("/all-orders", verifyJWT , getAllOrders);
router.post("/assign/:orderId",verifyJWT , assignOrder);

//delivery person
router.put("/profile", verifyJWT, checkActiveDeliveryPerson, updateProfile);
router.get("/assigned-orders", verifyJWT ,checkActiveDeliveryPerson, getAssignedOrders);
router.post("/accept/:id",verifyJWT, checkActiveDeliveryPerson, acceptOrder);
router.post("/update-status/:id",verifyJWT, checkActiveDeliveryPerson, updateStatus);
router.get("/history",verifyJWT, checkActiveDeliveryPerson, getDeliveryHistory);

module.exports = router;

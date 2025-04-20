const jwt = require("jsonwebtoken");
const DeliveryPerson = require("../Models/DeliveryPerson"); // Adjust the path if needed

const checkActiveDeliveryPerson = async (req, res, next) => {
  try {

    // 3. Check if role is "delivery"
    if (req.user.role !== "delivery") {
      return res.status(403).json({ message: "Forbidden: Not a delivery personnel" });
    }

    // 4. Find delivery person by userId and check status
    const deliveryPerson = await DeliveryPerson.findOne({ userId: req.user.id });

    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person profile not found" });
    }

    if (deliveryPerson.status !== "Active") {
      return res.status(403).json({ message: "Delivery person is not active" });
    }

    // 5. Attach user info to request for later use
    req.deliveryPerson = deliveryPerson;

    next(); // proceed to route handler
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = checkActiveDeliveryPerson;

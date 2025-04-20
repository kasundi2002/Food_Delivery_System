const axios = require("axios");
const makeServiceRequest = require("./serviceRequest");
const DeliveryPerson = require("./../Models/DeliveryPerson");

// Delivery service

// Get all orders (for testing or admin-level views)
const getAllOrders = async (token) => {
  const res = await axios.get(`${ORDER_SERVICE_BASE_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


//Automatically assign an available delivery person to an order
const assignOrder = async (orderId) => {
  const availableDriver = await DeliveryPerson.findOne({
    isAvailable: true,
    status: "Active",
  }).sort({ updatedAt: 1 });

  if (!availableDriver) {
    throw new Error("No available delivery person found");
  }

  // Assign via order-service
  const res = await axios.post(`${ORDER_SERVICE_BASE_URL}/assign/${orderId}`, {
    deliveryPersonId: availableDriver._id,
  });

  // Optionally set driver to unavailable (if you're limiting to 1 order at a time)
  availableDriver.isAvailable = false;
  await availableDriver.save();

  return res.data;
};




module.exports = {
  getAllOrders,
  assignOrder,
};

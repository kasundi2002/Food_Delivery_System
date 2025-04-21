// Description: This file contains the service functions for the delivery person service.
const makeServiceRequest = require("./serviceRequest");
const DeliveryPerson = require("../Models/DeliveryPerson");

// Automatically assign an available delivery person to an order
const assignOrder = async (orderId, token = null) => {
  // 1. Find the first available delivery person
  const availableDriver = await DeliveryPerson.findOne({
    isAvailable: true,
    status: "Active",
  }).sort({ updatedAt: 1 });

  if (!availableDriver) {
    throw new Error("No available delivery person found");
  }

  // 2. Assign the delivery person to the order via order-service
  const result = await makeServiceRequest(
    "orderService",
    "POST",
    `/assign/${orderId}`,
    { deliveryPersonId: availableDriver._id },
    token
  );

  // 3. Mark the driver as unavailable (optional)
  availableDriver.isAvailable = false;
  await availableDriver.save();

  return {
    message: "Order successfully assigned to delivery person",
    orderResult: result,
    deliveryPerson: {
      id: availableDriver._id,
      name: availableDriver.name,
      email: availableDriver.email,
    },
  };
};

// 🚀 Update delivery person's profile
const updateProfile = async (deliveryPersonId, updates) => {
  const updated = await DeliveryPerson.findByIdAndUpdate(
    deliveryPersonId,
    { $set: updates },
    { new: true }
  );
  return updated;
};

// ✅ Fetch assigned orders from order-service
const getAssignedOrders = async (deliveryPersonId, token) => {
  return await makeServiceRequest(
    "orderService",
    "GET",
    `/delivery/${deliveryPersonId}/assigned`,
    {}, // no body for GET
    token
  );
};

// ✅ Accept a specific order
const acceptOrder = async (orderId, deliveryPersonId, token) => {
  return await makeServiceRequest(
    "orderService",
    "POST",
    `/accept/${orderId}`,
    { deliveryPersonId },
    token
  );
};

// ✅ Update the order status (e.g., Out for Delivery, Delivered)
const updateOrderStatus = async (orderId, status, token) => {
  return await makeServiceRequest(
    "orderService",
    "PUT",
    `/status/${orderId}`,
    { status },
    token
  );
};

// ✅ Get delivery history from order-service
const getDeliveryHistory = async (deliveryPersonId, token) => {
  return await makeServiceRequest(
    "orderService",
    "GET",
    `/delivery/${deliveryPersonId}/history`,
    {}, // no body for GET
    token
  );
};

module.exports = {
  getAssignedOrders,
  acceptOrder,
  updateOrderStatus,
  getDeliveryHistory,
  updateProfile,
  assignOrder,
};

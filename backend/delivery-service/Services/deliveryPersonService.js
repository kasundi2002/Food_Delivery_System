const makeServiceRequest = require("./serviceRequest");
const DeliveryPerson = require("./../Models/DeliveryPerson");

//delivery person related services

//Update delivery person's profile
const updateProfile = async (deliveryPersonId, updates) => {
  const updated = await DeliveryPerson.findByIdAndUpdate(
    deliveryPersonId,
    { $set: updates },
    { new: true }
  );
  return updated;
};


// Fetch all currently assigned orders to the delivery person
const getAssignedOrders = async (deliveryPersonId) => {
  const orders = await Order.find({
    deliveryPerson: deliveryPersonId,
    status: { $ne: "Delivered" }
  }).sort({ createdAt: -1 });

  return orders;
};

//Accept a specific order

const acceptOrder = async (orderId, deliveryPersonId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  // Optional: Prevent double-assignment
  if (
    order.deliveryPerson &&
    order.deliveryPerson.toString() !== deliveryPersonId.toString()
  ) {
    throw new Error("Order already accepted by another delivery person");
  }

  // Assign and update status
  order.deliveryPerson = deliveryPersonId;
  order.status = "Accepted";
  await order.save();

  return order;
};

// const acceptOrder = async (orderId, deliveryPersonId, token) => {
//   return await makeServiceRequest(
//     "orderService",
//     "POST",
//     `/accept/${orderId}`,
//     { deliveryPersonId },
//     token
//   );

    // const res = await axios.post(
    //   `${ORDER_SERVICE_URL}/accept/${orderId}`,
    //   { deliveryPersonId },
    //   { headers: { Authorization: `Bearer ${token}` } }
    // );
    // return res.data;
// };


//Update the status of a specific order (e.g., PickedUp, OnTheWay, Delivered)

const updateOrderStatus = async (orderId, status, deliveryPersonId) => {
  const order = await Order.findOne({
    _id: orderId,
    deliveryPerson: deliveryPersonId,
  });

  if (!order) {
    throw new Error("Order not found or not assigned to this delivery person");
  }

  order.status = status;
  await order.save();

  return order;
};

 //Fetch delivery history for the delivery person

const getDeliveryHistory = async (deliveryPersonId) => {
  return await Order.find({
    deliveryPerson: deliveryPersonId,
    status: "Delivered",
  }).sort({ deliveredAt: -1 }); // Optional: if you track delivery time
};

module.exports = {
  getAssignedOrders,
  acceptOrder,
  updateOrderStatus,
  getDeliveryHistory,
  updateProfile,
};
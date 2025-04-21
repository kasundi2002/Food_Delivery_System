const Order = require("./../Models/Order");
const orderService = require("../Services/orderService");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Get All Orders Error:", err.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const getUnassignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPerson: null }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Get Unassigned Orders Error:", err.message);
    res.status(500).json({ message: "Failed to fetch unassigned orders" });
  }
};

const acceptOrder = async (req, res) => {
  try {
    const { deliveryPersonId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (
      order.deliveryPerson &&
      order.deliveryPerson.toString() !== deliveryPersonId
    ) {
      return res.status(400).json({ message: "Order already accepted" });
    }

    order.deliveryPerson = deliveryPersonId;
    order.status = "Accepted";
    await order.save();

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error accepting order" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { deliveryPersonId, status } = req.body;
    const orderId = req.params.id;

    const updatedOrder = await orderService.updateOrderStatus(orderId, status, deliveryPersonId);
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Update Order Status Error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

const getDeliveryHistory = async (req, res) => {
  try {
    const { deliveryPersonId, startDate, endDate, status } = req.query;
    const filters = {
      startDate,
      endDate,
      status
    };

    const orders = await orderService.getDeliveryHistory(deliveryPersonId, filters);
    res.status(200).json(orders);
  } catch (err) {
    console.error("Get Delivery History Error:", err.message);
    res.status(500).json({ message: "Error fetching delivery history" });
  }
};

module.exports = {
  getAllOrders,
  getUnassignedOrders,
  acceptOrder,
  updateOrderStatus,
  getDeliveryHistory,
};
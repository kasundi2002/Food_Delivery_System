const Order = require("./../Models/Order");

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
    const order = await Order.findOne({
      _id: req.params.id,
      deliveryPerson: deliveryPersonId,
    });

    if (!order)
      return res
        .status(404)
        .json({ message: "Order not found or not assigned to you" });

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error updating order status" });
  }
};

const getDeliveryHistory = async (req, res) => {
  try {
    const { deliveryPersonId } = req.query;
    const orders = await Order.find({
      deliveryPerson: deliveryPersonId,
      status: "Delivered",
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

module.exports = {
  getAllOrders,
  getUnassignedOrders,
  acceptOrder,
  updateOrderStatus,
  getDeliveryHistory,
};
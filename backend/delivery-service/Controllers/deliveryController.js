const deliveryService = require("./../Services/deliveryService");

// 📦 GET /api/delivery/assigned
const getAssignedOrders = async (req, res) => {
  try {
    const orders = await deliveryService.getAssignedOrders(
      req.user.id,
      req.token
    );
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching assigned orders:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 📦 GET /api/delivery/history
const getDeliveryHistory = async (req, res) => {
  try {
    const history = await deliveryService.getDeliveryHistory(
      req.user.id,
      req.token
    );
    res.status(200).json(history);
  } catch (err) {
    console.error("Error fetching delivery history:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🚚 POST /api/delivery/accept/:orderId
const acceptOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const result = await deliveryService.acceptOrder(
      orderId,
      req.user.id,
      req.token
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Error accepting order:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 📦 PUT /api/delivery/status/:orderId
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const result = await deliveryService.updateOrderStatus(
      orderId,
      status,
      req.token
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Error updating order status:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 👤 PUT /api/delivery/profile
const updateProfile = async (req, res) => {
  try {
    const updated = await deliveryService.updateProfile(req.user.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// 🧠 POST /api/delivery/assign (called internally by order-service or admin)
const assignOrder = async (req, res) => {
  const { orderId } = req.body;
  try {
    const result = await deliveryService.assignOrder(orderId, req.token);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error assigning order:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAssignedOrders,
  getDeliveryHistory,
  acceptOrder,
  updateOrderStatus,
  updateProfile,
  assignOrder,
};

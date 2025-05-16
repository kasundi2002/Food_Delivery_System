const Order = require("../Models/Order");

// Get all orders by restaurant ID
const getOrdersByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const orders = await Order.find({ restaurantId: restaurantId }).sort({
      createdAt: -1,
    }); // Latest orders first

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by restaurant:", error.message);
    res.status(500).json({ message: "Failed to fetch orders for restaurant" });
  }
};
// Update order status by Order ID
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // order ID from URL
    const { status, updatedBy } = req.body; // new status and updater's userID
console.log("Request Body:", req.body);
console.log("Request Params:", req.params);
    // Validate input
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findOne({
      _id: id,
    });

    if (!order) {
      throw new Error(
        "Order not found or not assigned to this delivery person"
      );
    }

    // Validate status transition

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status: status,
        lastUpdated: new Date(),
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: status,
            timestamp: new Date(),
            updatedBy: updatedBy,
          },
        ],
      },
      { new: true }
    );
    console.log(status);
console.log("Updated Order:", updatedOrder);
    res
      .status(200)
      .json({ message: "Order status updated successfully", updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ message: "Failed to update order status" });
  }
};
module.exports = {
  getOrdersByRestaurant,
  updateOrderStatus,
};

const Order = require("./../Models/Order");
const orderService = require("../Services/orderService");

const createOrder = async (req, res) => {
  try {
    const {
      customerId,
      restaurantId,
      deliveryPerson, // optional
      items,
      totalAmount,
      deliveryLocation,
      restaurantLocation,
      deliveryTimeEstimate,
      paymentMethod,
      paymentStatus, // optional
    } = req.body;

    const newOrder = new Order({
      customerId,
      restaurantId,
      deliveryPerson: deliveryPerson || null,
      items,
      totalAmount,
      deliveryLocation,
      restaurantLocation,
      deliveryTimeEstimate,
      paymentMethod,
      paymentStatus: paymentStatus || "Pending", // default if not provided
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error });
  }
};


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

const assignDeliveryPerson = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryPersonId } = req.body;

    // 1. Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. Assign the delivery person and update status
    order.deliveryPerson = deliveryPersonId;
    order.status = "Assigned";

    // 3. Push into status history
    // order.statusHistory.push({
    //   status: "Assigned",
    //   updatedBy: deliveryPersonId, // or use req.user.id if needed
    // });

    // // 4. Update last updated time
    // order.lastUpdated = Date.now();

    await order.save();

    res.status(200).json({
      message: "Delivery person assigned successfully",
      order,
    });
  } catch (err) {
    console.error("Error assigning delivery person:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Function to get assigned orders for a delivery person
const getAssignedOrders = async (req, res) => {
  console.log("Fetching assigned orders for delivery person");

  const deliveryPersonId = req.params.id; // Assuming you have user authentication (e.g., via JWT)
  console.log("Delivery Person ID:", deliveryPersonId);

  try {
    // Fetch orders where the assignedTo field matches the delivery person’s ID
    const assignedOrders = await Order.find({ deliveryPerson: deliveryPersonId });

    if (assignedOrders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No assigned orders found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assigned orders retrieved successfully",
      data: assignedOrders,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching assigned orders",
      error: error.message,
    });
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

// PUT /orders/decline/:orderId
const declineOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deliveryPersonId = req.body.deliveryPersonId; // Optional, for logging or verification

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.deliveryPerson || order.deliveryPerson.toString() !== deliveryPersonId) {
      return res.status(403).json({ message: "You are not assigned to this order" });
    }

    // Update order: remove assignment and set status back to Pending
    order.deliveryPerson = null;
    order.status = "Pending";

    // Add to status history
    order.statusHistory.push({
      status: "Pending",
      updatedBy: deliveryPersonId,
    });

    await order.save();

    res.status(200).json({
      message: "Order declined and set back to Pending",
      order,
    });
  } catch (error) {
    console.error("Error declining order:", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  createOrder,
  getAllOrders,
  assignDeliveryPerson,
  getUnassignedOrders,
  
  getAssignedOrders,
  declineOrder,
  acceptOrder,
  updateOrderStatus,
  getDeliveryHistory,
};
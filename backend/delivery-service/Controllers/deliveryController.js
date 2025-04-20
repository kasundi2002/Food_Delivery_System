const deliveryService = require("../services/deliveryPersonService");
const axios = require("axios");

// updateProfile
 //PUT /api/delivery/profile
 //Allows a delivery person to update their profile

const updateProfile = async (req, res) => {
  try {
    const deliveryPersonId = req.deliveryPerson._id;
    const updates = req.body;

    const updated = await DeliveryPerson.findByIdAndUpdate(
      deliveryPersonId,
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Delivery person not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", data: updated });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};


 //GET /api/delivery/all-orders
 //Fetch all orders from the order-service (testing/admin use)

const getAllOrders = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const orders = await deliveryService.getAllOrders(token);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get All Orders Error:", error.message);
    res.status(500).json({
      message: error.response?.data?.message || "Failed to fetch all orders",
    });
  }
};

// const AssignOrder (automatically)
 //POST /api/delivery/assign/:orderId
 //Automatically assigns the order to an available delivery person
 
const assignOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the first available & active delivery person
    const availableDriver = await DeliveryPerson.findOne({
      isAvailable: true,
      status: "Active"
    }).sort({ updatedAt: 1 }); // Optional: pick the least recently updated

    if (!availableDriver) {
      return res.status(404).json({ message: "No available delivery person found" });
    }

    // Call order-service to assign this person to the order
    const response = await axios.post(`http://order-service:4001/api/orders/assign/${orderId}`, {
      deliveryPersonId: availableDriver._id
    });

    // Optionally update driver availability if you want to limit one delivery at a time
    availableDriver.isAvailable = false;
    await availableDriver.save();

    res.status(200).json({ message: "Order assigned successfully", data: response.data });
  } catch (error) {
    console.error("Assign Order Error:", error.message);
    res.status(500).json({ message: error.response?.data?.message || "Failed to assign order" });
  }
};


//GET /api/delivery/assigned-orders
//Get all current orders assigned to the delivery person

const getAssignedOrders = async (req, res) => {
  try {
    const deliveryPersonId = req.deliveryPerson._id;

    const orders = await deliveryService.getAssignedOrders(deliveryPersonId);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Assigned Orders Error:", error.message);
    res.status(500).json({
      message: error.message || "Failed to fetch assigned orders",
    });
  }
};

// POST /api/delivery/accept/:id
// Accept an order

const acceptOrder = async (req, res) => {
  try {
    const deliveryPersonId = req.deliveryPerson._id;
    const orderId = req.params.id;

    const result = await deliveryService.acceptOrder(orderId, deliveryPersonId);
    res.status(200).json({ message: "Order accepted", data: result });
  } catch (error) {
    console.error("Accept Order Error:", error.message);
    res
      .status(500)
      .json({ message: error.message || "Failed to accept order" });
  }
};



//POST /api/delivery/update-status/:id
// Update order delivery status

const updateStatus = async (req, res) => {
  try {
    const deliveryPersonId = req.deliveryPerson._id;
    const orderId = req.params.id;
    const { status } = req.body;

    const updated = await deliveryService.updateOrderStatus(
      orderId,
      status,
      deliveryPersonId
    );
    res.status(200).json({ message: "Order status updated", data: updated });
  } catch (error) {
    console.error("Update Status Error:", error.message);
    res.status(500).json({ message: "Failed to update order status" });
  }
};


 //GET /api/delivery/history
 //Get completed delivery history

const getDeliveryHistory = async (req, res) => {
  try {
    const deliveryPersonId = req.deliveryPerson._id;

    const history = await deliveryService.getDeliveryHistory(deliveryPersonId);
    res.status(200).json(history);
  } catch (error) {
    console.error("Get Delivery History Error:", error.message);
    res.status(500).json({ message: "Failed to fetch delivery history" });
  }
};


module.exports = {
  getAssignedOrders,
  acceptOrder,
  updateStatus,
  getDeliveryHistory,
  updateProfile,
  getAllOrders,
  assignOrder,
};

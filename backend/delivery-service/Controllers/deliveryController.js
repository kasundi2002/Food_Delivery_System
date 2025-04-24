const deliveryService = require("./../Services/deliveryService");
const DeliveryPerson = require("./../Models/DeliveryPerson");

// 🧠 POST /api/delivery/assign 
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

// 👤 PUT /api/delivery/profile
// Update delivery person profile
const updateProfile = async (req, res) => {
  try {
    const updated = await DeliveryPerson.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Delivery profile not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get delivery person profile
const getProfile = async (req, res) => {
  try {
    console.log("inside getProfile function");
    console.log("Fetching profile for user ID:", req.user.id);
    console.log();

    const profile = await DeliveryPerson.findOne({ userId: req.user.id });
    console.log("profile:", profile);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// GET /delivery/availability/:id
const checkAvailability = async (req, res) => {
  console.log("Checking availability for user ID:", req.params.id);
  try {
    const userId = req.params.id;
    console.log("User ID from params:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    // Find delivery person by userId (not by _id)
    const deliveryPerson = await DeliveryPerson.findOne({ userId });

    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }

    res.status(200).json({
      deliveryPersonId: deliveryPerson._id,
      name: deliveryPerson.name,
      isAvailable: deliveryPerson.isAvailable,
      status: deliveryPerson.status,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /delivery/availability/:id
const updateAvailability = async (req, res) => {
  try {
    const deliveryPersonId = req.params.id;
    const { isAvailable } = req.body; // optional - if not provided, toggle

    const deliveryPerson = await DeliveryPerson.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }

    // Toggle if value not provided
    if (typeof isAvailable === "undefined") {
      deliveryPerson.isAvailable = !deliveryPerson.isAvailable;
    } else {
      deliveryPerson.isAvailable = isAvailable;
    }

    await deliveryPerson.save();

    res.status(200).json({
      message: "Availability updated",
      deliveryPersonId: deliveryPerson._id,
      isAvailable: deliveryPerson.isAvailable,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  updateProfile,
  getProfile,
  assignOrder,
  checkAvailability,
  updateAvailability,
};

// 📦 GET /api/delivery/history
// const getDeliveryHistory = async (req, res) => {
//   try {
//     const history = await deliveryService.getDeliveryHistory(
//       req.user.id,
//       req.token
//     );
//     res.status(200).json(history);
//   } catch (err) {
//     console.error("Error fetching delivery history:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// 🚚 POST /api/delivery/accept/:orderId
// const acceptOrder = async (req, res) => {
//   const { orderId } = req.params;
//   try {
//     const result = await deliveryService.acceptOrder(
//       orderId,
//       req.user.id,
//       req.token
//     );
//     res.status(200).json(result);
//   } catch (err) {
//     console.error("Error accepting order:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

// 📦 PUT /api/delivery/status/:orderId
// const updateOrderStatus = async (req, res) => {
//   const { orderId } = req.params;
//   const { status } = req.body;
//   try {
//     const result = await deliveryService.updateOrderStatus(
//       orderId,
//       status,
//       req.token
//     );
//     res.status(200).json(result);
//   } catch (err) {
//     console.error("Error updating order status:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };
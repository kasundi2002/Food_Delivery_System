const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Order = require("../Models/Order");
const DeliveryPerson = require("../Models/DeliveryPerson");

const JWT_SECRET = process.env.JWT_SECRET || "kasundi";
const MONGODB_URI =
  process.env.TEST_MONGODB_URI ||
  "mongodb+srv://kasundi2002:kasundi@forum.0prmr.mongodb.net/DS?retryWrites=true&w=majority&appName=Forum";

let token;
let deliveryUserId;
let testOrderId;

const setupDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    await Order.deleteMany({});

    // Try to find existing delivery person by email
    let deliveryPerson = await DeliveryPerson.findOne({
      email: "rider@test.com",
    });

    if (!deliveryPerson) {
      deliveryPerson = await DeliveryPerson.create({
        userId: new mongoose.Types.ObjectId(),
        name: "Test Rider",
        email: "rider@test.com",
        location: { type: "Point", coordinates: [80.5, 7.1] },
        address: { type: "Point", coordinates: [80.5, 7.1] },
        phone: "0771234567",
        license: "ABC123",
        vehicleNumber: "VEH001",
        gender: "Male",
        status: "Active",
      });
    }

    deliveryUserId = deliveryPerson.userId;

    // Generate token (use new or existing user)
    token = jwt.sign(
      { id: deliveryUserId, role: "DeliveryPerson" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const order = await Order.create({
      customer: new mongoose.Types.ObjectId(),
      restaurant: new mongoose.Types.ObjectId(),
      deliveryLocation: { type: "Point", coordinates: [80.5, 7.1] },
      restaurantLocation: { type: "Point", coordinates: [80.4, 7.0] },
      total: 12.5,
      status: "Pending",
    });

    testOrderId = order._id;

    console.log("✅ Test database setup complete.");
    console.log(`🔑 JWT: ${token}`);
    console.log(`🚴 Delivery User ID: ${deliveryUserId}`);
    console.log(`📦 Test Order ID: ${testOrderId}`);
  } catch (err) {
    console.error("❌ Error setting up test database:", err);
    process.exit(1);
  }
};

module.exports = {
  setupDatabase,
  getToken: () => token,
  getDeliveryUserId: () => deliveryUserId,
  getTestOrderId: () => testOrderId,
};

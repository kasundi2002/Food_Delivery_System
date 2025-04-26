const mongoose = require("mongoose");
const Order = require("./models/Order"); // Adjust if your path is different

// MongoDB connection URI
const MONGODB_URI =
  "mongodb+srv://kasundi2002:kasundi@forum.0prmr.mongodb.net/DS?retryWrites=true&w=majority&appName=Forum"; // <-- change this to your DB name

const createDummyOrders = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    const deliveryPersonId = new mongoose.Types.ObjectId(
      "680a38f512f8613fd821416b"
    );

    const orders = [
      {
        _id: new mongoose.Types.ObjectId(),
        deliveryPerson: deliveryPersonId,
        status: "Delivered",
        createdAt: new Date("2025-04-01T08:00:00Z"),
        updatedAt: new Date("2025-04-01T08:30:00Z"),
        customerId: new mongoose.Types.ObjectId(),
        restaurantId: new mongoose.Types.ObjectId(),
        totalAmount: 25,
        items: [
          { foodItem: new mongoose.Types.ObjectId(), name: "Pizza", quantity: 1 },
          { foodItem: new mongoose.Types.ObjectId(), name: "Pasta", quantity: 2 },
        ],
        deliveryLocation: { type: "Point", coordinates: [79.9582, 6.9271] },
        restaurantLocation: { type: "Point", coordinates: [79.9582, 6.9271] },
        paymentMethod: "Credit Card",
        paymentStatus: "Paid",
      },
      {
        _id: new mongoose.Types.ObjectId(),
        deliveryPerson: deliveryPersonId,
        status: "OnTheWay",
        createdAt: new Date("2025-04-05T12:00:00Z"),
        updatedAt: new Date("2025-04-05T12:30:00Z"),
        customerId: new mongoose.Types.ObjectId(),
        restaurantId: new mongoose.Types.ObjectId(),
        totalAmount: 15,
        items: [
          { foodItem: new mongoose.Types.ObjectId(), name: "Burger", quantity: 1 },
        ],
        deliveryLocation: { type: "Point", coordinates: [79.9582, 6.9271] },
        restaurantLocation: { type: "Point", coordinates: [79.9582, 6.9271] },
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending",
      },
      {
        _id: new mongoose.Types.ObjectId(),
        deliveryPerson: deliveryPersonId,
        status: "PickedUp",
        createdAt: new Date("2025-04-10T09:30:00Z"),
        updatedAt: new Date("2025-04-10T09:45:00Z"),
        customerId: new mongoose.Types.ObjectId(),
        restaurantId: new mongoose.Types.ObjectId(),
        totalAmount: 30,
        items: [
          { foodItem: new mongoose.Types.ObjectId(), name: "Kottu", quantity: 1 },
          { foodItem: new mongoose.Types.ObjectId(), name: "Juice", quantity: 1 },
        ],
        deliveryLocation: { type: "Point", coordinates: [79.8721, 6.9295] },
        restaurantLocation: { type: "Point", coordinates: [79.8612, 6.9279] },
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending",
      },
      {
        _id: new mongoose.Types.ObjectId(),
        deliveryPerson: deliveryPersonId,
        status: "Delivered",
        createdAt: new Date("2025-03-28T14:15:00Z"),
        updatedAt: new Date("2025-03-28T14:45:00Z"),
        customerId: new mongoose.Types.ObjectId(),
        restaurantId: new mongoose.Types.ObjectId(),
        totalAmount: 18,
        items: [
          {
            foodItem: new mongoose.Types.ObjectId(),
            name: "Rice & Curry",
            quantity: 1,
          },
        ],
        deliveryLocation: { type: "Point", coordinates: [79.85, 6.93] },
        restaurantLocation: { type: "Point", coordinates: [79.84, 6.926] },
        paymentMethod: "Credit Card",
        paymentStatus: "Paid",
      },
      {
        _id: new mongoose.Types.ObjectId(),
        deliveryPerson: deliveryPersonId,
        status: "Delivered",
        createdAt: new Date("2025-04-03T10:00:00Z"),
        updatedAt: new Date("2025-04-03T10:30:00Z"),
        customerId: new mongoose.Types.ObjectId(),
        restaurantId: new mongoose.Types.ObjectId(),
        totalAmount: 55,
        items: [
          { foodItem: new mongoose.Types.ObjectId(), name: "Biryani", quantity: 2 },
          { foodItem: new mongoose.Types.ObjectId(), name: "Raita", quantity: 1 },
        ],
        deliveryLocation: { type: "Point", coordinates: [79.865, 6.9333] },
        restaurantLocation: { type: "Point", coordinates: [79.86, 6.925] },
        paymentMethod: "Net Banking",
        paymentStatus: "Paid",
      },
    ];

    await Order.insertMany(orders);
    console.log("✅ Dummy orders added successfully!");
  } catch (error) {
    console.error("❌ Error adding dummy orders:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

createDummyOrders();

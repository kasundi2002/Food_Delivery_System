const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Customer = require("./models/Customer");
const Restaurant = require("./models/Restaurant");
const DeliveryPerson = require("./models/DeliveryPerson");
const Order = require("./models/Order");

//node seed.js


const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://kasundi2002:kasundi@forum.0prmr.mongodb.net/DS?retryWrites=true&w=majority&appName=Forum"
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Connection error", err.message);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Customer.deleteMany();
    await Restaurant.deleteMany();
    await DeliveryPerson.deleteMany();
    await Order.deleteMany();

    const hashPassword = async (password) => await bcrypt.hash(password, 10);

    // Create users

    console.log("Inserting users...");
    const [user1, user2, user3, user4, user5] = await User.insertMany([
      {
        name: "Kasun Silva",
        email: "kasun@example.com",
        password: await hashPassword("kasun123"),
        role: "customer",
      },
      {
        name: "Amal Perera",
        email: "amal@example.com",
        password: await hashPassword("amal123"),
        role: "customer",
      },
      {
        name: "Sahandi",
        email: "Sahandi.delivery@example.com",
        password: await hashPassword("Sahandi"),
        role: "delivery",
      },
      {
        name: "Nishantha Fernando",
        email: "nishantha.delivery@example.com",
        password: await hashPassword("nishantha"),
        role: "delivery",
      },
      {
        name: "Lucky Foods",
        email: "lucky.restaurant@example.com",
        password: await hashPassword("restaurant123"),
        role: "restaurant",
      },
    ],{ ordered: true }).catch((err) => {
      console.error("Error inserting users:", err.message);
    });
    
    console.log("Users inserted.");


    // Create customers
    console.log("Inserting customers...");
    await Customer.insertMany([
      {
        userId: user1._id,
        name: user1.name,
        email: user1.email,
        phone: "0771000001",
        address: {
          type: "Point",
          coordinates: [79.8612, 6.9271], // Colombo
        },
        favoriteRestaurants: [],
        orderHistory: [],
        status: "Active",
      },
      {
        userId: user2._id,
        name: user2.name,
        email: user2.email,
        phone: "0771000002",
        address: {
          type: "Point",
          coordinates: [80.5998, 7.2964], // Kurunegala
        },
        favoriteRestaurants: [],
        orderHistory: [],
        status: "Active",
      },
    ],{ ordered: true }).catch((err) => {
      console.error("Error inserting customers:", err.message);
    });

    console.log("Customers inserted.");

    // Create delivery persons
    console.log("Inserting delivery persons...");
    const [delivery1, delivery2] = await DeliveryPerson.insertMany([
      {
        userId: user3._id,
        name: user3.name,
        email: user3.email,
        phone: "0771234567",
        vehicleNumber: "NCB-4567",
        license: "LIC1234567",
        gender: "Female",
        isAvailable: true,
        status: "Active",
        location: {
          type: "Point",
          coordinates: [79.9586, 6.9093], // Malabe
        },
        address: {
          type: "Point",
          coordinates: [79.9586, 6.9093],
        },
      },
      {
        userId: user4._id,
        name: user4.name,
        email: user4.email,
        phone: "0771234577",
        vehicleNumber: "CAB-3214",
        license: "LIC7891011",
        gender: "Male",
        isAvailable: true,
        status: "Active",
        location: {
          type: "Point",
          coordinates: [79.96, 6.91], // Malabe
        },
        address: {
          type: "Point",
          coordinates: [79.96, 6.91],
        },
      },
    ] , { ordered: true }).catch((err) => {
      console.error("Error inserting delivery persons:", err.message);
    });

    console.log("Delivery persons inserted.");

    // Create restaurant
    console.log("Inserting restaurant...");
    const restaurant = await Restaurant.create({
      userId: user5._id,
      restaurantName: "Lucky Foods",
      restaurantOwner: user5.name,
      email: user5.email,
      phone: "0772000000",
      category: "Sri Lankan",
      address: {
        type: "Point",
        coordinates: [79.8643, 6.9278], // Kollupitiya
      },
      items: [
        {
          name: "Kottu",
          price: 400,
          description: "Spicy Chicken Kottu",
        },
        {
          name: "Rice & Curry",
          price: 350,
          description: "Lunch Pack",
        },
      ],
      status: "Active",
    });
    console.log("Restaurant inserted.");

    // Orders
    console.log("Inserting orders...");
    const orders = [
      // Assigned and Delivered (for history)
      {
        customerId: user1._id,
        restaurantId: restaurant._id,
        deliveryPerson: delivery1._id,
        items: [{ name: "Kottu", quantity: 2 }],
        total: 800,
        deliveryLocation: {
          type: "Point",
          coordinates: [79.8615, 6.9274],
        },
        restaurantLocation: {
          type: "Point",
          coordinates: [79.8643, 6.9278],
        },
        status: "Delivered",
        lastUpdated: new Date(),
        statusHistory: [
          { status: "Pending", timestamp: new Date(), updatedBy: user1._id },
          { status: "Assigned", timestamp: new Date(), updatedBy: user3._id },
          { status: "Accepted", timestamp: new Date(), updatedBy: user3._id },
          { status: "Delivered", timestamp: new Date(), updatedBy: user3._id },
        ],
      },
      // Unassigned
      {
        customerId: user1._id,
        restaurantId: restaurant._id,
        deliveryPerson: null,
        items: [{ name: "Rice & Curry", quantity: 1 }],
        total: 350,
        deliveryLocation: {
          type: "Point",
          coordinates: [79.8612, 6.9271],
        },
        restaurantLocation: {
          type: "Point",
          coordinates: [79.8643, 6.9278],
        },
        status: "Pending",
        lastUpdated: new Date(),
        statusHistory: [
          { status: "Pending", timestamp: new Date(), updatedBy: user1._id },
        ],
      },
      // Another unassigned
      {
        customerId: user2._id,
        restaurantId: restaurant._id,
        deliveryPerson: null,
        items: [{ name: "Kottu", quantity: 1 }],
        total: 400,
        deliveryLocation: {
          type: "Point",
          coordinates: [80.5998, 7.2964],
        },
        restaurantLocation: {
          type: "Point",
          coordinates: [79.8643, 6.9278],
        },
        status: "Pending",
        lastUpdated: new Date(),
        statusHistory: [
          { status: "Pending", timestamp: new Date(), updatedBy: user2._id },
        ],
      },
      // Ongoing status for delivery history
      {
        customerId: user2._id,
        restaurantId: restaurant._id,
        deliveryPerson: delivery2._id,
        items: [{ name: "Rice & Curry", quantity: 2 }],
        total: 700,
        deliveryLocation: {
          type: "Point",
          coordinates: [79.8585, 6.9272],
        },
        restaurantLocation: {
          type: "Point",
          coordinates: [79.8643, 6.9278],
        },
        status: "PickedUp",
        lastUpdated: new Date(),
        statusHistory: [
          { status: "Pending", timestamp: new Date(), updatedBy: user2._id },
          { status: "Assigned", timestamp: new Date(), updatedBy: user4._id },
          { status: "Accepted", timestamp: new Date(), updatedBy: user4._id },
          { status: "PickedUp", timestamp: new Date(), updatedBy: user4._id },
        ],
      },
      {
        customerId: user1._id,
        restaurantId: restaurant._id,
        deliveryPerson: null,
        items: [{ name: "Kottu", quantity: 1 }],
        total: 400,
        deliveryLocation: {
          type: "Point",
          coordinates: [79.86, 6.915], // Pettah
        },
        restaurantLocation: {
          type: "Point",
          coordinates: [79.8643, 6.9278],
        },
        status: "Pending",
        lastUpdated: new Date(),
        statusHistory: [
          { status: "Pending", timestamp: new Date(), updatedBy: user1._id },
        ],
      },
      {
        customerId: user1._id,
        restaurantId: restaurant._id,
        deliveryPerson: delivery2._id,
        items: [{ name: "Kottu", quantity: 3 }],
        total: 1200,
        deliveryLocation: {
          type: "Point",
          coordinates: [79.874, 6.9], // Bambalapitiya
        },
        restaurantLocation: {
          type: "Point",
          coordinates: [79.8643, 6.9278],
        },
        status: "Accepted",
        lastUpdated: new Date(),
        statusHistory: [
          { status: "Pending", timestamp: new Date(), updatedBy: user1._id },
          { status: "Assigned", timestamp: new Date(), updatedBy: user4._id },
          { status: "Accepted", timestamp: new Date(), updatedBy: user4._id },
        ],
      },
      {
        customerId: user1._id,
        restaurantId: restaurant._id,
        deliveryPerson: delivery1._id,
        items: [{ name: "Rice & Curry", quantity: 2 }],
        total: 700,
        deliveryLocation: {
          type: "Point",
          coordinates: [79.888, 6.909], // Wellawatte
        },
        restaurantLocation: {
          type: "Point",
          coordinates: [79.8643, 6.9278],
        },
        status: "PickedUp",
        lastUpdated: new Date(),
        statusHistory: [
          { status: "Pending", timestamp: new Date(), updatedBy: user1._id },
          { status: "Assigned", timestamp: new Date(), updatedBy: user3._id },
          { status: "Accepted", timestamp: new Date(), updatedBy: user3._id },
          { status: "PickedUp", timestamp: new Date(), updatedBy: user3._id },
        ],
      },
      {
        customerId: user1._id,
        restaurantId: restaurant._id,
        deliveryPerson: delivery1._id,
        items: [{ name: "Kottu", quantity: 1 }],
        total: 400,
        deliveryLocation: {
          type: "Point",
          coordinates: [79.87, 6.911], // Slave Island
        },
        restaurantLocation: {
          type: "Point",
          coordinates: [79.8643, 6.9278],
        },
        status: "OnTheWay",
        lastUpdated: new Date(),
        statusHistory: [
          { status: "Pending", timestamp: new Date(), updatedBy: user1._id },
          { status: "Assigned", timestamp: new Date(), updatedBy: user3._id },
          { status: "Accepted", timestamp: new Date(), updatedBy: user3._id },
          { status: "PickedUp", timestamp: new Date(), updatedBy: user3._id },
          { status: "OnTheWay", timestamp: new Date(), updatedBy: user3._id },
        ],
      },
      {
        customerId: user1._id,
        restaurantId: restaurant._id,
        deliveryPerson: delivery2._id,
        items: [{ name: "Rice & Curry", quantity: 1 }],
        total: 350,
        deliveryLocation: {
          type: "Point",
          coordinates: [79.8723, 6.9142], // Union Place
        },
        restaurantLocation: {
          type: "Point",
          coordinates: [79.8643, 6.9278],
        },
        status: "Delivered",
        lastUpdated: new Date(),
        statusHistory: [
          { status: "Pending", timestamp: new Date(), updatedBy: user1._id },
          { status: "Assigned", timestamp: new Date(), updatedBy: user4._id },
          { status: "Accepted", timestamp: new Date(), updatedBy: user4._id },
          { status: "PickedUp", timestamp: new Date(), updatedBy: user4._id },
          { status: "OnTheWay", timestamp: new Date(), updatedBy: user4._id },
          { status: "Delivered", timestamp: new Date(), updatedBy: user4._id },
        ],
      },
      {
        customerId: user1._id,
        restaurantId: restaurant._id,
        deliveryPerson: null,
        items: [{ name: "Kottu", quantity: 1 }],
        total: 400,
        deliveryLocation: {
          type: "Point",
          coordinates: [79.8765, 6.9271], // Colombo 02
        },
        restaurantLocation: {
          type: "Point",
          coordinates: [79.8643, 6.9278],
        },
        status: "Pending",
        lastUpdated: new Date(),
        statusHistory: [
          { status: "Pending", timestamp: new Date(), updatedBy: user1._id },
        ],
      },
      {
        customerId: user1._id,
        restaurantId: restaurant._id,
        deliveryPerson: delivery2._id,
        items: [{ name: "Rice & Curry", quantity: 1 }],
        total: 350,
        deliveryLocation: {
          type: "Point",
          coordinates: [79.8801, 6.9331], // Dematagoda
        },
        restaurantLocation: {
          type: "Point",
          coordinates: [79.8643, 6.9278],
        },
        status: "OnTheWay",
        lastUpdated: new Date(),
        statusHistory: [
          { status: "Pending", timestamp: new Date(), updatedBy: user1._id },
          { status: "Assigned", timestamp: new Date(), updatedBy: user4._id },
          { status: "Accepted", timestamp: new Date(), updatedBy: user4._id },
          { status: "PickedUp", timestamp: new Date(), updatedBy: user4._id },
          { status: "OnTheWay", timestamp: new Date(), updatedBy: user4._id },
        ],
      },
      {
        customerId: user1._id,
        restaurantId: restaurant._id,
        deliveryPerson: delivery1._id,
        items: [{ name: "Kottu", quantity: 2 }],
        total: 800,
        deliveryLocation: {
          type: "Point",
          coordinates: [79.8902, 6.9256], // Borella
        },
        restaurantLocation: {
          type: "Point",
          coordinates: [79.8643, 6.9278],
        },
        status: "Delivered",
        lastUpdated: new Date(),
        statusHistory: [
          { status: "Pending", timestamp: new Date(), updatedBy: user1._id },
          { status: "Assigned", timestamp: new Date(), updatedBy: user3._id },
          { status: "Accepted", timestamp: new Date(), updatedBy: user3._id },
          { status: "PickedUp", timestamp: new Date(), updatedBy: user3._id },
          { status: "OnTheWay", timestamp: new Date(), updatedBy: user3._id },
          { status: "Delivered", timestamp: new Date(), updatedBy: user3._id },
        ],
      },
    ];

    await Order.insertMany(orders, { ordered: true }).catch((err => {
      console.error("Error inserting orders:", err.message);
    }));

    console.log("Orders inserted.");
    console.log();

    const orderCount = await Order.countDocuments();
    console.log("Total orders in DB:", orderCount);
    const customerCount = await Customer.countDocuments();
    console.log("Total customers in DB:", customerCount);

    const restaurantCount = await Restaurant.countDocuments();
    console.log("Total restaurants in DB:", restaurantCount);

    const deliveryCount = await DeliveryPerson.countDocuments();
    console.log("Total delivery persons in DB:", deliveryCount);

    const userCount = await User.countDocuments();
    console.log("Total users in DB:", userCount);

    console.log();
    console.log("✅ Seed data inserted successfully!");
    process.exit();
    
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
    process.exit(1);
  }
};

seed();
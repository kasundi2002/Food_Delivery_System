const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Customer = require("./models/Customer");
const DeliveryPerson = require("./models/DeliveryPerson");
const Restaurant = require("./models/Restaurant");
const Product = require("./models/Product");
const Order = require("./models/Order");

mongoose.connect(
  "mongodb+srv://kasundi2002:kasundi@forum.0prmr.mongodb.net/DS?retryWrites=true&w=majority&appName=Forum"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Database connected");

  try {
    await User.deleteMany({});
    await Customer.deleteMany({});
    await DeliveryPerson.deleteMany({});
    await Restaurant.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    // Create users
    const users = await User.insertMany([
      {
        //1
        name: "John Doe",
        email: "john@example.com",
        password: await hashPassword("password123"),
        role: "customer",
      },
      {
        //2
        name: "Jane Rider",
        email: "jane@example.com",
        password: await hashPassword("password123"),
        role: "customer",
      },
      {
        //3
        name: "amal Rider",
        email: "amal@example.com",
        password: await hashPassword("password123"),
        role: "customer",
      },
      {
        //4
        name: "saman Rider",
        email: "saman@example.com",
        password: await hashPassword("password123"),
        role: "customer",
      },
      {
        //5
        name: "neesha Rider",
        email: "neesha@example.com",
        password: await hashPassword("password123"),
        role: "customer",
      },
      {
        //6
        name: "Ravi Delivery",
        email: "ravi@example.com",
        password: await hashPassword("password123"),
        role: "delivery",
      },
      {
        //7
        name: "Nimal Delivery",
        email: "nimal@example.com",
        password: await hashPassword("password123"),
        role: "delivery",
      },
      {
        //8
        name: "Pizza Palace",
        email: "pizza@example.com",
        password: await hashPassword("password123"),
        role: "restaurant",
      },
      {
        //9
        name: "Burger Barn",
        email: "burger@example.com",
        password: await hashPassword("password123"),
        role: "restaurant",
      },
    ]);

    const customers = await Customer.insertMany([
      {
        userId: users[0]._id,
        name: "John Doe",
        email: users[0].email,
        address: {
          coordinates: [79.8612, 6.9271],
        },
      },
      {
        userId: users[1]._id,
        name: "Jane Rider",
        email: users[1].email,
        address: {
          coordinates: [79.8707, 6.9026],
        },
      },
      {
        userId: users[2]._id,
        name: "John Doe",
        email: users[2].email,
        address: {
          coordinates: [79.85, 6.933],
        },
      },
      {
        userId: users[3]._id,
        name: "John Doe",
        email: users[3].email,
        address: {
          coordinates: [79.8568, 6.8946],
        },
      },
      {
        userId: users[4]._id,
        name: "John Doe",
        email: users[4].email,
        address: {
          coordinates: [79.904, 6.905],
        },
      },
    ]);

    const deliveryPeople = await DeliveryPerson.insertMany([
      {
        userId: users[5]._id,
        name: "Ravi Delivery",
        email: users[5].email,
        vehicleNumber: "WP-1234",
        license: "DL12345",
        address: { coordinates: [79.8655, 6.9155] },
        location: { coordinates: [79.8655, 6.9155] },
      },
      {
        userId: users[6]._id,
        name: "Nimal Delivery",
        email: users[6].email,
        vehicleNumber: "WP-5678",
        license: "DL56789",
        address: { coordinates: [79.8765, 6.927] },
        location: { coordinates: [79.8765, 6.927] },
      },
    ]);

    const restaurants = await Restaurant.insertMany([
      {
        userId: users[7]._id,
        restaurantName: "Pizza Palace",
        restaurantOwner: "Chef Mario",
        address: { coordinates: [79.86, 6.93] },
        email: users[7].email,
        items: [],
      },
      {
        userId: users[8]._id,
        restaurantName: "Burger Barn",
        restaurantOwner: "Chef John",
        address: { coordinates: [79.87, 6.91] },
        email: users[8].email,
        items: [],
      },
    ]);

    const products = await Product.insertMany([
      {
        name: "Cheese Pizza",
        price: 1200,
        description: "Delicious cheese pizza",
        restaurantId: restaurants[0]._id,
      },
      {
        name: "Veggie Burger",
        price: 900,
        description: "Fresh veggie burger",
        restaurantId: restaurants[1]._id,
      },
    ]);

    const orders = await Order.insertMany([
      {
        customerId: users[0]._id,
        restaurantId: restaurants[0]._id,
        items: [{ name: "Cheese Pizza", quantity: 2 }],
        total: 2400,
        deliveryLocation: { coordinates: [79.8612, 6.9271] },
        restaurantLocation: { coordinates: [79.86, 6.93] },
      },
      {
        customerId: users[1]._id,
        restaurantId: restaurants[1]._id,
        items: [{ name: "Veggie Burger", quantity: 1 }],
        total: 900,
        deliveryLocation: { coordinates: [79.8707, 6.9026] },
        restaurantLocation: { coordinates: [79.87, 6.91] },
        deliveryPerson: deliveryPeople[0]._id,
        status: "Assigned",
      },
      {
        customerId: users[1]._id,
        restaurantId: restaurants[1]._id,
        deliveryPerson: null,
        items: [
          { name: "Chicken Biryani", quantity: 1 },
          { name: "Coke", quantity: 2 },
        ],
        total: 1200,
        deliveryLocation: { type: "Point", coordinates: [79.8612, 6.9271] },
        restaurantLocation: { type: "Point", coordinates: [79.8585, 6.9298] },
        status: "Pending",
        statusHistory: [],
      },
      {
        customerId: users[2]._id,
        restaurantId: restaurants[0]._id,
        deliveryPerson: deliveryPeople[1]._id,
        items: [{ name: "Veg Kottu", quantity: 2 }],
        total: 800,
        deliveryLocation: { type: "Point", coordinates: [79.8605, 6.9135] },
        restaurantLocation: { type: "Point", coordinates: [79.8629, 6.9152] },
        status: "Assigned",
        statusHistory: [],
      },
      {
        customerId: users[3]._id,
        restaurantId: restaurants[1]._id,
        deliveryPerson: null,
        items: [{ name: "Seafood Fried Rice", quantity: 1 }],
        total: 1000,
        deliveryLocation: { type: "Point", coordinates: [79.8564, 6.914] },
        restaurantLocation: { type: "Point", coordinates: [79.8578, 6.9125] },
        status: "Pending",
        statusHistory: [],
      },
      {
        customerId: users[4]._id,
        restaurantId: restaurants[1]._id,
        deliveryPerson: deliveryPeople[0]._id,
        items: [
          { name: "Nasi Goreng", quantity: 1 },
          { name: "Ice Milo", quantity: 1 },
        ],
        total: 950,
        deliveryLocation: { type: "Point", coordinates: [79.8631, 6.9182] },
        restaurantLocation: { type: "Point", coordinates: [79.8585, 6.9298] },
        status: "Accepted",
        statusHistory: [],
      },
      {
        customerId: users[5]._id,
        restaurantId: restaurants[0]._id,
        deliveryPerson: null,
        items: [
          { name: "Mutton Curry", quantity: 1 },
          { name: "Parata", quantity: 3 },
        ],
        total: 1100,
        deliveryLocation: { type: "Point", coordinates: [79.8575, 6.93] },
        restaurantLocation: { type: "Point", coordinates: [79.8578, 6.9125] },
        status: "Pending",
        statusHistory: [],
      },
      {
        customerId: users[1]._id,
        restaurantId: restaurants[1]._id,
        deliveryPerson: deliveryPeople[0]._id,
        items: [{ name: "Fried Rice", quantity: 2 }],
        total: 1300,
        deliveryLocation: { type: "Point", coordinates: [79.859, 6.919] },
        restaurantLocation: { type: "Point", coordinates: [79.8629, 6.9152] },
        status: "PickedUp",
        statusHistory: [],
      },
      {
        customerId: users[2]._id,
        restaurantId: restaurants[1]._id,
        deliveryPerson: null,
        items: [
          { name: "Pizza", quantity: 1 },
          { name: "Water", quantity: 1 },
        ],
        total: 1500,
        deliveryLocation: { type: "Point", coordinates: [79.864, 6.925] },
        restaurantLocation: { type: "Point", coordinates: [79.8585, 6.9298] },
        status: "Pending",
        statusHistory: [],
      },
      {
        customerId: users[2]._id,
        restaurantId: restaurants[0]._id,
        deliveryPerson: deliveryPeople[1]._id,
        items: [{ name: "Dosa", quantity: 2 }],
        total: 700,
        deliveryLocation: { type: "Point", coordinates: [79.857, 6.928] },
        restaurantLocation: { type: "Point", coordinates: [79.8578, 6.9125] },
        status: "OnTheWay",
        statusHistory: [],
      },
      {
        customerId: users[4]._id,
        restaurantId: restaurants[1]._id,
        deliveryPerson: deliveryPeople[1]._id,
        items: [{ name: "Pasta", quantity: 1 }],
        total: 900,
        deliveryLocation: { type: "Point", coordinates: [79.862, 6.926] },
        restaurantLocation: { type: "Point", coordinates: [79.8629, 6.9152] },
        status: "Delivered",
        statusHistory: [],
      },
      {
        customerId: users[5]._id,
        restaurantId: restaurants[1]._id,
        deliveryPerson: null,
        items: [{ name: "Milk Tea", quantity: 2 }],
        total: 300,
        deliveryLocation: { type: "Point", coordinates: [79.8595, 6.9181] },
        restaurantLocation: { type: "Point", coordinates: [79.8578, 6.9125] },
        status: "Pending",
        statusHistory: [],
      },
      {
        customerId: users[4]._id,
        restaurantId: restaurants[1]._id,
        deliveryPerson: deliveryPeople[0]._id,
        items: [{ name: "Burger", quantity: 2 }],
        total: 1000,
        deliveryLocation: { type: "Point", coordinates: [79.8601, 6.92] },
        restaurantLocation: { type: "Point", coordinates: [79.8585, 6.9298] },
        status: "Assigned",
        statusHistory: [],
      },
      {
        customerId: users[3]._id,
        restaurantId: restaurants[0]._id,
        deliveryPerson: deliveryPeople[0]._id,
        items: [{ name: "Roast Chicken", quantity: 1 }],
        total: 950,
        deliveryLocation: { type: "Point", coordinates: [79.8619, 6.9166] },
        restaurantLocation: { type: "Point", coordinates: [79.8629, 6.9152] },
        status: "OnTheWay",
        statusHistory: [],
      },
      {
        customerId: users[3]._id,
        restaurantId: restaurants[1]._id,
        deliveryPerson: null,
        items: [{ name: "Egg Fried Rice", quantity: 2 }],
        total: 800,
        deliveryLocation: { type: "Point", coordinates: [79.8603, 6.9265] },
        restaurantLocation: { type: "Point", coordinates: [79.8585, 6.9298] },
        status: "Pending",
        statusHistory: [],
      },
      {
        customerId: users[2]._id,
        restaurantId: restaurants[0]._id,
        deliveryPerson: deliveryPeople[1]._id,
        items: [{ name: "Wade", quantity: 5 }],
        total: 500,
        deliveryLocation: { type: "Point", coordinates: [79.856, 6.9233] },
        restaurantLocation: { type: "Point", coordinates: [79.8578, 6.9125] },
        status: "PickedUp",
        statusHistory: [],
      },
      {
        customerId: users[4]._id,
        restaurantId: restaurants[1]._id,
        deliveryPerson: null,
        items: [{ name: "Fried Chicken", quantity: 1 }],
        total: 950,
        deliveryLocation: { type: "Point", coordinates: [79.8613, 6.9175] },
        restaurantLocation: { type: "Point", coordinates: [79.8629, 6.9152] },
        status: "Pending",
        statusHistory: [],
      },
    ]);

    console.log("Database seeded!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
});

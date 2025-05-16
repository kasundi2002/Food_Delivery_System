const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const productRoutes = require("./Routes/ProductRoutes");
const orderRoutes = require("./Routes/OrderRoutes");
const restaurantRoutes = require("./Routes/RestaurantRoutes");

require("dotenv").config();
const app = express(); // ✅ Initialize app first!

// Middleware
app.use(cors()); // ✅ Enable CORS
app.use(express.json()); // ✅ Parse JSON bodies

// Routes
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/restaurant", restaurantRoutes);

// Start server
const PORT = process.env.PORT || 3002;

// Database connection
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

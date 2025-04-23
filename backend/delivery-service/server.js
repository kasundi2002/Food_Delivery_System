const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const deliveryRoutes = require("./Routes/deliveryRoutes");

require("dotenv").config();
const app = express(); // ✅ Initialize app first!

// Middleware
app.use(cors()); // ✅ Enable CORS
app.use(express.json()); // ✅ Parse JSON bodies

// Routes
app.use("/api/delivery", deliveryRoutes);

// Start server
const PORT = process.env.PORT || 4100;

// Database connection
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

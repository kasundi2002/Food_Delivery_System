const express = require("express");
const connectDB = require("./src/config/db");

const deliveryRoutes = require("./src/routes/deliveryRoutes");

require("dotenv").config();
const app = express();

app.use(express.json());

app.use("/api/delivery", deliveryRoutes);

const PORT = process.env.PORT || 4100;
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
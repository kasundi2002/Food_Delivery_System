const express = require("express");
const connectDB = require("./src/config/db");

const orderRoutes = require("./src/routes/orderRoutes");

require("dotenv").config();
const app = express();

app.use(express.json());

app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 4001;
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

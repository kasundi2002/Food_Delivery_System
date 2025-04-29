const express = require("express");
const cors = require("cors");
const connectDB = require("./../src/config/db");

const notificationRoutes = require("./../src/routes/notificationRoutes");

require("dotenv").config();
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 4001;
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

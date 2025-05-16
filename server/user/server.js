const express = require("express");
const connectDB = require("./src/config/db");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;
connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

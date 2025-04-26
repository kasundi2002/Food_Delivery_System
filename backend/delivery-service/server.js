const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");

const { Server } = require("socket.io");

const deliveryRoutes = require("./Routes/deliveryRoutes");

require("dotenv").config();

const app = express(); // ✅ Initialize app first!
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Update with frontend URL if needed
    methods: ["GET", "POST"],
  },
});

app.use(cors()); // ✅ Enable CORS
app.use(express.json()); // ✅ Parse JSON bodies


// Routes
app.use("/api/delivery", deliveryRoutes);

// Socket.IO events
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Make `io` accessible to other modules (optional)
app.set("io", io);

// Start server
const PORT = process.env.PORT || 4100;

// Database connection
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

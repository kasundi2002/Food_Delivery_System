require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//import routes
const orderRoutes = require('./Routes/OrderRoutes.js');
const productRoutes = require('./Routes/productRoutes.js');
const restaurantRoutes = require('./Routes/restaurantRoutes.js');

// Create an express app
const app = express();

//middleware
app.use(express.json());

//front end url connection
app.use(cors({
  origin: process.env.CLIENT_URL
}));

//log requests
app.use((req, res, next) => {
    console.log("A new request received at " + Date.now());
    console.log(req.path , req.method);
    next();
});

//routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/restaurants', restaurantRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
  
      //listen to port
      const PORT = process.env.PORT || 3003;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
  
    .catch(err => console.error('MongoDB connection error:', err)
);
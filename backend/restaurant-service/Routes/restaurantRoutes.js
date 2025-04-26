// routes/restaurantRoutes.js

const express = require("express");
const router = express.Router();
const {
  addProductToRestaurant,
  getAllProductsInRestaurant,
} = require("../Controllers/productController");

//http://reataurant-service:5050/api/restaurant/:restaurantId/products
router.post("/:restaurantId/products", addProductToRestaurant);
//http://reataurant-service:5050/api/restaurant/:restaurantId/products
router.get("/:restaurantId/products", getAllProductsInRestaurant);


module.exports = router;

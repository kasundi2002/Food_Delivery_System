// routes/restaurantRoutes.js

const express = require("express");
const router = express.Router();
const {
  addProductToRestaurant,
} = require("../controllers/restaurantController");

router.post("/:restaurantId/products", addProductToRestaurant);

module.exports = router;

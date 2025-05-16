const express = require("express");
const router = express.Router();
const restaurantController = require("../Controllers/RestaurantController");



// Get a restaurant by ID
router.get("/:id", restaurantController.getRestaurantById);

// Update a restaurant by ID
router.put("/:id", restaurantController.updateRestaurant);

module.exports = router;

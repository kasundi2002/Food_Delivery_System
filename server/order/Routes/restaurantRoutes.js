const express = require("express");
const router = express.Router();
const {
    getAllRestaurants,
    getRestaurantById,
} = require("../Controllers/restaurentController.js");

// CRUD Routes for Restaurant
router.get("/", getAllRestaurants);              // Get all restaurants
router.get("/:id", getRestaurantById);           // Get a single restaurant by ID



module.exports = router;

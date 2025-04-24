// controllers/restaurantController.js

const Restaurant = require("../models/Restaurant");

const addProductToRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, price, description, isAvailable } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const newItem = {
      name,
      price,
      description,
      isAvailable: isAvailable ?? true,
    };

    restaurant.items.push(newItem);
    await restaurant.save();

    res.status(201).json({ message: "Product added successfully", restaurant });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addProductToRestaurant,
};

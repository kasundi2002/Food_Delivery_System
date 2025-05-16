const Restaurant = require("../Models/Resturent");

// Get restaurant details by ID
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (err) {
    console.error("Get Restaurant Error:", err.message);
    res.status(500).json({ message: "Error fetching restaurant data" });
  }
};

// Update restaurant details
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(updatedRestaurant);
  } catch (err) {
    console.error("Update Restaurant Error:", err.message);
    res.status(500).json({ message: "Error updating restaurant details" });
  }
};

module.exports = {
  getRestaurantById,
  updateRestaurant,
};

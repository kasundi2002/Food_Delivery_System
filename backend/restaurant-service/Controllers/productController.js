const Restaurant = require("../Models/Restaurant");
const Product = require("../Models/Product");

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error("Get All Products Error:", err.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    console.error("Get Product Error:", err.message);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// controllers/restaurantController.js

const Restaurant = require("../Models/Restaurant");
const Product = require("../Models/Product");

const addProductToRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, price, description, isAvailable } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const product = new Product({
      name,
      price,
      description,
      isAvailable: isAvailable ?? true,
      restaurantId, // ✅ Add the missing restaurantId
    });

    await product.save();

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

// Update an existing product
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Update Product Error:", err.message);
    res.status(400).json({ message: "Failed to update product" });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete Product Error:", err.message);
    res.status(500).json({ message: "Failed to delete product" });
  }
};


// 🥘 GET /api/restaurants/:restaurantId/items
const getAllProductsInRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      message: "Products fetched successfully",
      items: restaurant.items,
    });
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addProductToRestaurant,
  getAllProductsInRestaurant, 
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,

};

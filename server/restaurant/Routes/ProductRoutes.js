const express = require("express");
const router = express.Router();
const productController = require("../Controllers/ProductController");

// CRUD Routes for Product
router.get("/", productController.getAllProducts);              // Get all products
router.get("/:id", productController.getProductById);           // Get a single product by ID
router.post("/", productController.createProduct);              // Create a new product
router.put("/:id", productController.updateProduct);            // Update a product
router.delete("/:id", productController.deleteProduct);         // Delete a product

module.exports = router;

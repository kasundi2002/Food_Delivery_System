//product routers
const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,} = require("../Controllers/productController.js");

// CRUD Routes for Product
router.get("/", getAllProducts);              // Get all products
router.get("/:id", getProductById);           // Get a single product by ID
router.put("/:id", updateProduct);            // Update a product
router.delete("/:id", deleteProduct);         // Delete a product

module.exports = router;
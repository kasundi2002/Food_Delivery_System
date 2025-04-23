const express = require("express");
const { registerUser, loginController} = require("./../Controllers/authController");
const authMiddleware = require("./../middleware/authMiddleware");

const router = express.Router();

//register user
// http://localhost:8080/api/auth/register
router.post("/register", registerUser);

//login user
// http://localhost:8080/api/auth/login
router.post("/login", loginController);

module.exports = router;
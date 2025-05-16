const express = require("express");
const { registerUser, loginController} = require("./../Controllers/authController");
const authMiddleware = require("./../middleware/authMiddleware");

const router = express.Router();

//register user
// http://localhost:3001/api/auth/register
router.post("/register", registerUser);

//login user
// http://localhost:3001/api/auth/login
router.post("/login", loginController);

module.exports = router;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phone, password: hashedPassword, role });

    await newUser.save();
    return newUser;
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
        console.log("Login failed: Email not found");
        throw new Error("Invalid email or password"); // Ensure a generic error message
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        console.log("Login failed: Incorrect password");
        throw new Error("Invalid email or password"); // Keep error message generic
    }

    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        {expiresIn: "1d",}
    );

    return {
        token,
        userId: user._id,
        name: user.name,  // Add other user details as needed
        role: user.role,
        email: user.email,  // Example additional details
    };
};

const getUserById = async (userId) => {
    return await User.findById(userId).select("-password");
};

module.exports = { registerUser, loginUser, getUserById };
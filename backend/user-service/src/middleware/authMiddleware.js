const jwt = require("jsonwebtoken");
const User = require("./../models/User");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};

const verifyRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== "admin") throw new Error("Access Denied: Admins Only");
        next();
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

const isRestaurant = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== "restaurant") throw new Error("Access Denied: Restaurants Only");
        next();
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

const isCustomer = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== "customer") throw new Error("Access Denied: Customers Only");
        next();
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

const isDeliveryPerson = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== "delivery") throw new Error("Access Denied: Delivery People Only");
        next();
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};



// Exporting the functions
module.exports = {
    verifyToken,
    verifyRole,
    isAdmin,
    isRestaurant,
    isCustomer,
    isDeliveryPerson
};

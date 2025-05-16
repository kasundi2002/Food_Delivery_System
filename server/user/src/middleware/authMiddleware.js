const jwt = require("jsonwebtoken");
const User = require("./../models/User");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    req.token = token; // for forwarding to internal service requests
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
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

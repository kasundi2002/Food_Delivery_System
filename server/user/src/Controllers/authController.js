const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const DeliveryPerson = require("../models/DeliveryPerson");
const Customer = require("../models/Customer");
const Admin = require("../models/Admin");

const {loginUser} = require("./../services/authService");

const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
try{
    const userData = req.body;
    
    const { name, email, password, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already registered");
    if (
      !req.body.address ||
      !Array.isArray(req.body.address.coordinates) ||
      req.body.address.coordinates.includes(null)
    ) {
      return res
        .status(400)
        .json({ error: "Valid address coordinates are required" });
    }

    if (
      !req.body.location ||
      !Array.isArray(req.body.location.coordinates) ||
      req.body.location.coordinates.includes(null)
    ) {
      return res
        .status(400)
        .json({ error: "Valid location coordinates are required" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine initial status
    const status = ["restaurant", "delivery"].includes(role) ? "Inactive" : "Active";

    // Create user
    const newUser = new User({
        name:name,
        email:email,
        password: hashedPassword,
        role:role,
        status,
    });

    await newUser.save();

    // If the role is restaurant or delivery, create a request entry
    if (role === "restaurant") {
        const newRestaurant = new Restaurant({
          userId: newUser._id,
          restaurantName: userData.restaurantName || "", // fallback to empty if not provided
          restaurantOwner: name,
          address: userData.location || "",
          phone: userData.phone || "",
          email: email,
          category: userData.category || "",
          status: "Inactive",
        });
       const restaurantResponse = await newRestaurant.save();
       
       if(restaurantResponse){
        console.log('newRestuarant:',newRestaurant)
        console.log('newRestuarant created successfully')
       }
       else{
        console.log('Error creating restaurant')
        throw new Error("Error creating restaurant");
       }

    } else if (role === "delivery") {
        const newDeliveryPerson = new DeliveryPerson({
          userId: newUser._id,
          name: name,
          address: userData.address, // ✅ from request
          location: userData.location, // ✅ from request
          email: email,
          phone: userData.phone || "",
          vehicleNumber: userData.vehicleNumber || "",
          license: userData.license || "",
          gender: userData.gender || "Male",
          isAvailable: userData.isAvailable ?? false,
          status: userData.status || "Pending",
        });
        const deliveryResponse = await newDeliveryPerson.save();

       if(deliveryResponse){
        console.log('newDeliveryPerson:',deliveryResponse)
        console.log('Delivery Person created successfully')
       }
       else{
        console.log('Error creating newDeliveryPerson')
        throw new Error("Error creating newDeliveryPerson");
       }

    } else if (role === "customer") {
        const newCustomer = new Customer({
          userId: newUser._id,
          name: name,
          address: userData.location || "",
          phone: userData.phone || "",
          email: email,
          favoriteRestaurants: [],
          orderHistory: [],
          status: "Active",
        });
        const CustomerResponse = await newCustomer.save();

        if(CustomerResponse){
        console.log('newCustomer:',CustomerResponse)
        console.log('Customer created successfully')
       }
       else{
        console.log('Error creating Customer')
        throw new Error("Error creating Customer");
       }

    } else if (role === "admin") {
        const newAdmin = new Admin({
          userId: newUser._id,
          name: name,
          email: email,
          phone: userData.phone || "",
          status: "Active",
        });
        const adminResponse = await newAdmin.save();

        if(adminResponse){
        console.log('new Admin:',adminResponse)
        console.log('Admin created successfully')
       }
       else{
        console.log('Error creating new Admin')
        throw new Error("Error creating new Admin");
       }
    }

    return res.status(201).json({
      message: "User registered successfully",
      newUser,
  });
}
  catch(err){
      console.error("Error in registerUser:", err.message); // Debugging log
      return res.status(500).json({ error: err.message });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt with email:", email); // Debugging log
        const token = await loginUser({ email, password });
        console.log("Token generated:", token); // Debugging log
        res.status(200).json({ token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


module.exports = { registerUser, loginController };

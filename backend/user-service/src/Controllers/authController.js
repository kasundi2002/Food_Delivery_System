const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const DeliveryPerson = require("../models/DeliveryPerson");
const Customer = require("../models/Customer");
const Admin = require("../models/Admin");

const {loginUser} = require("./../services/authService");

const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    console.log("Request body:", req.body); // Debugging log
    const userData = req.body;
    
    const { name, email, password, role } = userData;
    
    console.log("Inside authController: registerUser");
    console.log("name received:", name);
    console.log("email received:", email);
    console.log("Password received:", password);
    console.log("role received:", role);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already registered");

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
            restaurantName:"",
            restaurantOwner: name,
            address:"",
            phone:"",
            email:email,
            category:"",
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
            name:name,
            address:"",
            location: { type: "Point", coordinates: [0, 0] },
            email:email,
            phone:"",
            vehicleNumber:"",
            license:"",
            isAvailable: false,
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
            name:name,
            address: "",
            phone:"",
            email:email,
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
            name:name,
            email:email,
            phone:"",
            status:"Active"
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

    return newUser;
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser({ email, password });
        res.status(200).json({ token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


module.exports = { registerUser, loginController };

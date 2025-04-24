import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerFields from "./role-fields/CustomerFields";
import DeliveryPersonFields from "./role-fields/DeliveryPersonFields";
import RestaurantFields from "./role-fields/RestaurantFields";
import axios from "axios";
import "./../../styles/pages/registerPage.css";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
  });

  const [coordinates, setCoordinates] = useState(null); // 👈 Store location here

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form data before submission:", form);
        if (
            !coordinates || 
            !Array.isArray(coordinates.coordinates) || 
            coordinates.coordinates.length !== 2
          ) {
            alert("Please select a location on the map.");
            return;
            }
    
    // Final payload
    const formData = {
      ...form,
      location: coordinates, // 👈 Add location here if present
    };

    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", formData);
      if(res.status == 200) {
      alert("Registration successful!");
      navigate("/login");
      }
      
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <h2>User Registration</h2>

      <input
        placeholder="Name"
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <input
        placeholder="Email"
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => handleChange("password", e.target.value)}
      />

      <select
        onChange={(e) => {
          const selectedRole = e.target.value;
          setRole(selectedRole);
          handleChange("role", selectedRole);
        }}
      >
        <option value="">Select Role</option>
        <option value="customer">Customer</option>
        <option value="delivery">Delivery Person</option>
        <option value="restaurant">Restaurant</option>
      </select>

      {role === "customer" && <CustomerFields onChange={handleChange} />}
      {role === "delivery" && (
        <DeliveryPersonFields
          onChange={handleChange}
          onLocationChange={(coords) => setCoordinates(coords)} // 👈 receive location
        />
      )}
      {role === "restaurant" && <RestaurantFields onChange={handleChange} />}

      <button onClick={handleSubmit} className="register-button">
        Register
      </button>

      <div className="login-redirect-container">
      <button onClick={() => navigate("/login")} className="login-redirect-btn">
        Already have an account?{" "}
      </button>
      </div>
    </div>
  );
};

export default Register;
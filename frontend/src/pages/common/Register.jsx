import React, { useState } from "react";
import CustomerFields from "./role-fields/CustomerFields";
import DeliveryPersonFields from "./role-fields/DeliveryPersonFields";
import RestaurantFields from "./role-fields/RestaurantFields";
import axios from "axios";
import "./../../styles/pages/registerPage.css";

const Register = () => {
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

    // Check if location is required and available
    if (role === "delivery" && (!coordinates?.lat || !coordinates?.lng)) {
      alert("Please select a location on the map.");
      return;
    }

    // Final payload
    const formData = {
      ...form,
      location: coordinates, // 👈 Add location here if present
    };

    try {
      await axios.post("http://localhost:8080/api/auth/register", formData);
      alert("Registration successful!");
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

      <button onClick={handleSubmit}>Register</button>
    </div>
  );
};

export default Register;

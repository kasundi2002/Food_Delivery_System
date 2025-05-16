import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../../styles/pages/loginPage.css"; // 👈 Import the CSS

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Form data before submission:", form);
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3001/api/auth/login",
        form
      );
      console.log("login frontend")
      console.log(res);
      const { token } = res.data;
      console.log(res.data);      
      const user = {
        userId: token.userId,
        name: token.name,
        role: token.role,
        email: token.email,
      };
      console.log("Login response:", res.data); // 👈 Log the response data

      localStorage.setItem("token", JSON.stringify(res.data.token));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.userId);

      
      const userId = localStorage.getItem("userId");
      console.log("User ID from localStorage:", userId); // 👈 Log the user ID
      // Route user by role
        const roleRoutes = {
          delivery: "/delivery/home", 
          customer: "/customerHome",
          restaurant: "/restaurantHome",
          admin: "/adminHome",
        };

      const userRole = user.role || "";

      navigate(roleRoutes[userRole] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="text-danger">{error}</p>}

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button onClick={handleLogin}>Login</button>

      <div className="register-redirect-container">
        <button
          onClick={() => navigate("/register")}
          className="register-redirect-btn"
        >
          Don't have an account?{" "}
        </button>
      </div>
    </div>
  );
};

export default Login;

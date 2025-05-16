// import { useState } from 'react'
// import { Link, useNavigate, useLocation } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { FiUser, FiLock, FiMail, FiArrowRight } from 'react-icons/fi'
// import { useAuth } from '../contexts/AuthContext'
// import axios from "axios";

// function LoginPage() {
//   const [isLogin, setIsLogin] = useState(true)
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [name, setName] = useState('')
//   const { login, register, loading, error } = useAuth()
//   const navigate = useNavigate()
//   const location = useLocation()

//   // Get redirect path from location state or default to home
//   const from = location.state?.from?.pathname || '/'

//   const handleSubmit1 = async (e) => {
//     e.preventDefault()

//     let success
//     if (isLogin) {
//       success = await login(email, password)
//     } else {
//       success = await register({ name, email, password })
//     }

//     if (success) {
//       navigate(from, { replace: true })
//     }
//   }
//   const handleSubmit = async () => {
//     console.log("ji");
//     const form = {
//       email,
//       password,

//     };
// console.log(form);

//       const res = await axios.post(
//         "http://localhost:3001/api/auth/login",
//         form
//       );
//       console.log("login frontend")
//       console.log(res);
//       const { token } = res.data;
//       console.log(res.data);
//       const user = {
//         userId: token.userId,
//         name: token.name,
//         role: token.role,
//         email: token.email,
//       };
//       console.log("Login response:", res.data); // 👈 Log the response data

//       localStorage.setItem("token", JSON.stringify(res.data.token));
//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("userId", user.userId);


//       const userId = localStorage.getItem("userId");
//       console.log("User ID from localStorage:", userId); // 👈 Log the user ID
//       // Route user by role
//       const roleRoutes = {
//         delivery: "/delivery/home",
//         customer: "/customerHome",
//         restaurant: "/restaurantHome",
//         admin: "/adminHome",
//       };

//       const userRole = user.role || "";

//       // navigate(roleRoutes[userRole] || "/");
    
//   };
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <Link to="/" className="text-3xl font-heading font-bold text-primary-500">
//             FoodExpress
//           </Link>
//           <h2 className="mt-6 text-3xl font-bold text-neutral-900">
//             {isLogin ? 'Sign in to your account' : 'Create a new account'}
//           </h2>
//           <p className="mt-2 text-sm text-neutral-600">
//             {isLogin ? "Don't have an account?" : "Already have an account?"}
//             {' '}
//             <button
//               type="button"
//               className="font-medium text-primary-600 hover:text-primary-500"
//               onClick={() => setIsLogin(!isLogin)}
//             >
//               {isLogin ? 'Sign up' : 'Sign in'}
//             </button>
//           </p>
//         </div>

//         <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10">
//           <form className="space-y-6" >
//             {!isLogin && (
//               <div>
//                 <label htmlFor="name" className="label">
//                   Full Name
//                 </label>
//                 <div className="mt-1 relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FiUser className="h-5 w-5 text-neutral-400" />
//                   </div>
//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     required
//                     className="input pl-10"
//                     placeholder="John Doe"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                 </div>
//               </div>
//             )}

//             <div>
//               <label htmlFor="email" className="label">
//                 Email address
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiMail className="h-5 w-5 text-neutral-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="input pl-10"
//                   placeholder="you@example.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="label">
//                 Password
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiLock className="h-5 w-5 text-neutral-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete={isLogin ? "current-password" : "new-password"}
//                   required
//                   className="input pl-10"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </div>
//             </div>

//             {isLogin && (
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <input
//                     id="remember-me"
//                     name="remember-me"
//                     type="checkbox"
//                     className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
//                   />
//                   <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-900">
//                     Remember me
//                   </label>
//                 </div>

//                 <div className="text-sm">
//                   <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
//                     Forgot your password?
//                   </a>
//                 </div>
//               </div>
//             )}

//             {error && (
//               <div className="text-accent-600 text-sm mt-2">
//                 {error}
//               </div>
//             )}

//             <div>
//               <motion.button
//                 whileTap={{ scale: 0.98 }}
//                 type="submit"
//                 className="btn-primary w-full py-3 flex items-center justify-center"
//                 disabled={loading}
//                 onClick={handleSubmit}
//               >
//                 {loading ? (
//                   <span>Processing...</span>
//                 ) : (
//                   <>
//                     <span>{isLogin ? 'Sign in' : 'Sign up'}</span>
//                     <FiArrowRight className="ml-2" />
//                   </>
//                 )}
//               </motion.button>
//             </div>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-neutral-300" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-neutral-500">
//                   Or continue with
//                 </span>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 className="btn-outline flex items-center justify-center"
//               >
//                 <img
//                   src="https://www.svgrepo.com/show/475656/google-color.svg"
//                   alt="Google logo"
//                   className="h-5 w-5 mr-2"
//                 />
//                 <span>Google</span>
//               </button>
//               <button
//                 type="button"
//                 className="btn-outline flex items-center justify-center"
//               >
//                 <img
//                   src="https://www.svgrepo.com/show/448234/facebook.svg"
//                   alt="Facebook logo"
//                   className="h-5 w-5 mr-2"
//                 />
//                 <span>Facebook</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="text-center text-sm text-neutral-500">
//           By signing in, you agree to our{' '}
//           <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
//             Terms of Service
//           </a>{' '}
//           and{' '}
//           <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
//             Privacy Policy
//           </a>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginPage
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import "./../../styles/pages/loginPage.css"; // 👈 Import the CSS

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
          delivery: "/", 
          customer: "/",
          restaurant: "/",
          admin: "/",
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
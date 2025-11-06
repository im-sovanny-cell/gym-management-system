// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginApi } from "../../api/authApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginApi(email, password);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Login failed", "error");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Gym System Login</h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              value={email} onChange={(e) => setEmail(e.target.value)}
              type="email" required
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter Your Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                value={password} onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"} required
                className="w-full p-3 pr-12 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter Your Password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg transition">
            Login
          </button>
        </form>
        <p className="text-xs text-center text-gray-400 mt-8">
          © {new Date().getFullYear()} Gym Management System
        </p>
      </div>
    </div>
  );
}
// src/pages/auth/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../api/authApi";
import Swal from "sweetalert2";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", phone: "", address: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerApi(form);
      Swal.fire("Success", "User created!", "success");
      navigate("/users");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="firstName" placeholder="First Name" onChange={handleChange} required className="border p-3 rounded-lg" />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} required className="border p-3 rounded-lg" />
        </div>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="border p-3 rounded-lg w-full" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="border p-3 rounded-lg w-full" />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="border p-3 rounded-lg w-full" />
        <input name="address" placeholder="Address" onChange={handleChange} className="border p-3 rounded-lg w-full" />
        <button type="submit" className="bg-green-600 text-white py-3 rounded-lg w-full hover:bg-green-700">
          Create User
        </button>
      </form>
    </div>
  );
}
// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import AuthLayout from "../components/AuthLayout";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Get started with Yusra">
  <form onSubmit={handleSubmit} className="space-y-5">

    {error && (
      <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">
        {error}
      </p>
    )}

    {/* Full Name */}
    <div>
      <label className="text-sm font-medium text-gray-700">Full name</label>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        placeholder="Enter your name"
      />
    </div>

    {/* Email */}
    <div>
      <label className="text-sm font-medium text-gray-700">Email</label>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        type="email"
        placeholder="Enter your email"
      />
    </div>

    {/* Password */}
    <div>
      <label className="text-sm font-medium text-gray-700">Password</label>
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        placeholder="Create password"
      />
    </div>

    {/* Register Button */}
    <button
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-lg font-semibold transition active:scale-[.98]"
    >
      Register
    </button>

    {/* Sign in link */}
    <p className="text-sm text-center text-gray-600">
      Already have an account?{" "}
      <Link to="/" className="text-blue-600 hover:underline font-medium">
        Sign in
      </Link>
    </p>

  </form>
</AuthLayout>

  );
}

export default Register;

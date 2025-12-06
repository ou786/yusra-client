// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import AuthLayout from "../components/AuthLayout";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      setTimeout(() => {
        navigate("/dashboard");
      }, 50);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
  <form onSubmit={submit} className="space-y-5">

    {error && (
      <p className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded">
        {error}
      </p>
    )}

    {/* Email */}
    <div>
      <label className="text-sm font-medium text-gray-700">Email</label>
      <input
        className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    {/* Password */}
    <div>
      <label className="text-sm font-medium text-gray-700">Password</label>
      <input
        className="w-full mt-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    {/* Submit Button */}
    <button
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-lg font-semibold transition active:scale-[.98]"
    >
      Sign in
    </button>

    {/* Link */}
    <p className="text-sm text-center text-gray-600">
      Don’t have an account?{" "}
      <Link to="/register" className="text-blue-600 hover:underline font-medium">
        Register
      </Link>
    </p>
  </form>
</AuthLayout>

  );
}

export default Login;

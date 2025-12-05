import axios from "axios";

const API = axios.create({
  baseURL: "https://yusra-server.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

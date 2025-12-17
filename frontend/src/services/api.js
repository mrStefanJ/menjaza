import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api", // tvoje /api rute
  headers: {
    "Content-Type": "application/json"
  },
});

// Optional: interceptor da svaki zahtev automatski šalje token
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

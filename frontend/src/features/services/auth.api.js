import axios from "axios";

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes("192.168.")) {
    return envUrl;
  }
  // If running locally, automatically match localhost or window hostname
  if (typeof window !== "undefined" && window.location.hostname) {
    return `http://${window.location.hostname}:3000`;
  }
  return "http://localhost:3000";
};

export const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", { username, email, password });
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (err) {
    console.error("Register API error:", err);
    throw err.response?.data?.message || err.message || "Registration failed";
  }
}

export async function Login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (err) {
    console.error("Login API error:", err);
    throw err.response?.data?.message || err.message || "Login failed";
  }
}

export async function logout() {
  try {
    const response = await api.get("/api/auth/logout");
    localStorage.removeItem("token");
    return response.data;
  } catch (err) {
    console.error("Logout API error:", err);
    localStorage.removeItem("token");
    throw err.response?.data?.message || err.message || "Logout failed";
  }
}

export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");
    return response.data;
  } catch (err) {
    console.error("getMe API error:", err);
    throw err.response?.data?.message || err.message || "Failed to fetch user";
  }
}

import { api } from "../../services/auth.api"

export const getProfile = async () => {
  try {
    const response = await api.get("/api/auth/get-me")
    return response.data
  } catch (err) {
    console.error("Error fetching profile API:", err)
    throw err.response?.data?.message || err.message || "Failed to fetch profile"
  }
}

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put("/api/auth/profile", profileData)
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token)
    }
    return response.data
  } catch (err) {
    console.error("Error updating profile API:", err)
    throw err.response?.data?.message || err.message || "Failed to update profile"
  }
}

export const updatePassword = async (passwordData) => {
  try {
    const response = await api.put("/api/auth/password", passwordData)
    return response.data
  } catch (err) {
    console.error("Error updating password API:", err)
    throw err.response?.data?.message || err.message || "Failed to update password"
  }
}

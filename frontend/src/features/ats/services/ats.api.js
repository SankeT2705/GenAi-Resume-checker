import { api } from "../../services/auth.api"

export const analyzeResumeAts = async ({ resumeFile }) => {
  try {
    const formData = new FormData()
    formData.append("resume", resumeFile)

    const response = await api.post("/api/resume/check", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    return response.data
  } catch (err) {
    console.error("Error analyzing ATS resume API:", err)
    const serverMessage = err.response?.data?.message || err.response?.data?.error
    throw serverMessage || err.message || "Failed to perform ATS check"
  }
}

export const getResumeCheckById = async ({ checkId }) => {
  try {
    const response = await api.get(`/api/resume/${checkId}`)
    return response.data
  } catch (err) {
    console.error("Error fetching ATS report by ID API:", err)
    throw err.response?.data?.message || err.message || "Failed to fetch ATS report"
  }
}

export const getAllResumeChecks = async () => {
  try {
    const response = await api.get("/api/resume/history")
    return response.data
  } catch (err) {
    console.error("Error fetching ATS history API:", err)
    throw err.response?.data?.message || err.message || "Failed to fetch ATS history"
  }
}

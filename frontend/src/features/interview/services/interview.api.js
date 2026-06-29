import { api } from "../../services/auth.api"

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
  try {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    return response.data
  } catch (err) {
    console.error("Error generating report API:", err)
    const serverMessage = err.response?.data?.message || err.response?.data?.error
    throw serverMessage || err.message || "Failed to generate report"
  }
}

export const generateInterviewReportById = async ({ interviewId }) => {
  try {
    const response = await api.get(`/api/interview/report/${interviewId}`)
    return response.data
  } catch (err) {
    console.error("Error fetching report by ID API:", err)
    throw err.response?.data?.message || err.message || "Failed to fetch report"
  }
}

export const generateInterviewReports = async () => {
  try {
    const response = await api.get("/api/interview/")
    return response.data
  } catch (err) {
    console.error("Error fetching reports list API:", err)
    throw err.response?.data?.message || err.message || "Failed to fetch reports"
  }
}

export const downloadPerfectResumeApi = async ({ interviewId }) => {
  try {
    const response = await api.get(`/api/interview/report/${interviewId}/perfect-resume`, {
      responseType: "blob"
    })
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `Perfect_ATS_Resume_${interviewId.slice(-6)}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  } catch (err) {
    console.error("Error downloading perfect resume API:", err)
    throw "Failed to generate and download perfect resume PDF"
  }
}

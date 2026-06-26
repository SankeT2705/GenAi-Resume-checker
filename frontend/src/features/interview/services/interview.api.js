import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

const api =axios.create({
    baseURL: API_URL,
    withCredentials:true,

})

export const generateInterviewReport= async({jobDescription,selfDescription,resumeFile})=>{
    const formData=new FormData()
    formData.append("jobDescription",jobDescription)
    formData.append("selfDescription",selfDescription)
    formData.append("resume",resumeFile)

   const response= await api.post("/api/interview/",formData,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })

    return response.data
}
export const generateInterviewReportById=async({interviewId})=>{
    

   const response= await api.get(`/api/interview/report/${interviewId}`)
   return response.data
}
export const generateInterviewReports=async()=>{
     const response= await api.get("/api/interview/")
   return response.data 
}

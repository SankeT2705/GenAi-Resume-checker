import { generateInterviewReports, generateInterviewReport, generateInterviewReportById } from "../services/interview.api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context"

export const useInterview = () => {
  const context = useContext(InterviewContext)

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider")
  }
  const { loading, setLoading, report, setReport, reports, setReports } = context

  const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setLoading(true)
    try {
      const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
      setReport(response.interviewReport)
      return response.interviewReport
    } catch (err) {
      console.error("useInterview generateReport error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getReportById = async ({ interviewId }) => {
    setLoading(true)
    try {
      const response = await generateInterviewReportById({ interviewId })
      setReport(response.interviewReport)
      return response.interviewReport
    } catch (err) {
      console.error("useInterview getReportById error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getReports = async () => {
    setLoading(true)
    try {
      const response = await generateInterviewReports()
      setReports(response.interviewReports)
      return response.interviewReports
    } catch (err) {
      console.error("useInterview getReports error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { loading, report, reports, generateReport, getReportById, getReports }
}

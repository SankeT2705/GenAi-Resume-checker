const parsePdfBuffer = require("../utils/pdfParser")
const { generateInterviewReport, generatePerfectResumeData } = require("../services/ai.service")
const { createPerfectResumePdf } = require("../services/pdf.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to generate interview report
 */
async function generateInterViewReportController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required"
      })
    }

    const resumeContent = await parsePdfBuffer(req.file.buffer)
    const { selfDescription, jobDescription } = req.body

    if (!selfDescription || !jobDescription) {
      return res.status(400).json({
        message: "Self description and job description are required"
      })
    }

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription
    })

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
      ...interViewReportByAi
    })

    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport
    })
  } catch (error) {
    console.error("Error generating interview report:", error)
    res.status(500).json({
      message: error.message || "Error generating interview report",
      error: error.message
    })
  }
}

/**
 * @description Controller to get interview report by interviewId
 */
async function getInterviewReportByController(req, res) {
  try {
    const { interviewId } = req.params
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found"
      })
    }

    res.status(200).json({
      message: "Interview report fetched successfully",
      interviewReport
    })
  } catch (error) {
    console.error("Error fetching interview report:", error)
    res.status(500).json({
      message: "Error fetching interview report",
      error: error.message
    })
  }
}

/**
 * @description Controller to get all interview reports for user
 */
async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
      message: "Interview reports fetched successfully",
      interviewReports
    })
  } catch (error) {
    console.error("Error fetching interview reports:", error)
    res.status(500).json({
      message: "Error fetching interview reports",
      error: error.message
    })
  }
}

/**
 * @description Controller to generate and download Perfect ATS Resume PDF
 */
async function downloadPerfectResumeController(req, res) {
  try {
    const { interviewId } = req.params
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found"
      })
    }

    const perfectResumeData = await generatePerfectResumeData({
      resumeText: interviewReport.resume || "",
      selfDescription: interviewReport.selfDescription || "",
      jobDescription: interviewReport.jobDescription || "",
      skillGaps: interviewReport.skillGaps || []
    })

    const pdfBuffer = await createPerfectResumePdf(perfectResumeData)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="Perfect_ATS_Resume_${interviewId.slice(-6)}.pdf"`)
    res.send(pdfBuffer)
  } catch (error) {
    console.error("Error generating perfect resume PDF:", error)
    res.status(500).json({
      message: error.message || "Failed to generate perfect resume PDF",
      error: error.message
    })
  }
}

module.exports = {
  generateInterViewReportController,
  getInterviewReportByController,
  getAllInterviewReportsController,
  downloadPerfectResumeController
}
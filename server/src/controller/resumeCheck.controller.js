const pdfparse = require("pdf-parse")
const { analyzeResumeAts } = require("../services/ai.service")
const resumeCheckModel = require("../models/resumeCheck.model")

/**
 * @description Controller to analyze resume for ATS compliance
 */
async function analyzeResumeAtsController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF file is required"
      })
    }

    const resumeContent = await pdfparse(req.file.buffer)
    if (!resumeContent.text || !resumeContent.text.trim()) {
      return res.status(400).json({
        message: "Could not extract readable text from the uploaded PDF resume."
      })
    }

    const atsAnalysis = await analyzeResumeAts({
      resumeText: resumeContent.text
    })

    const resumeCheck = await resumeCheckModel.create({
      user: req.user.id,
      resumeText: resumeContent.text,
      ...atsAnalysis
    })

    res.status(201).json({
      message: "ATS resume check completed successfully",
      resumeCheck
    })
  } catch (error) {
    console.error("Error analyzing resume ATS:", error)
    res.status(500).json({
      message: error.message || "Error during ATS resume analysis",
      error: error.message
    })
  }
}

/**
 * @description Get ATS resume check report by ID
 */
async function getResumeCheckByIdController(req, res) {
  try {
    const { checkId } = req.params
    const resumeCheck = await resumeCheckModel.findOne({ _id: checkId, user: req.user.id })

    if (!resumeCheck) {
      return res.status(404).json({
        message: "ATS check report not found"
      })
    }

    res.status(200).json({
      message: "ATS report fetched successfully",
      resumeCheck
    })
  } catch (error) {
    console.error("Error fetching ATS report:", error)
    res.status(500).json({
      message: "Error fetching ATS report",
      error: error.message
    })
  }
}

/**
 * @description Get all ATS checks performed by user
 */
async function getAllResumeChecksController(req, res) {
  try {
    const checks = await resumeCheckModel.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("atsScore summary createdAt")

    res.status(200).json({
      message: "ATS check history fetched successfully",
      checks
    })
  } catch (error) {
    console.error("Error fetching ATS history:", error)
    res.status(500).json({
      message: "Error fetching ATS check history",
      error: error.message
    })
  }
}

module.exports = {
  analyzeResumeAtsController,
  getResumeCheckByIdController,
  getAllResumeChecksController
}

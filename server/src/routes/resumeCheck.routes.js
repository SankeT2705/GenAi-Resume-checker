const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const upload = require("../middlewares/file.middleware")
const resumeCheckController = require("../controller/resumeCheck.controller")

const resumeCheckRouter = express.Router()

/**
 * @route POST /api/resume/check
 * @description Analyze resume for standalone ATS check
 * @access Private
 */
resumeCheckRouter.post("/check", authMiddleware.authUser, upload.single("resume"), resumeCheckController.analyzeResumeAtsController)

/**
 * @route GET /api/resume/history
 * @description Get history of all ATS resume checks for user
 * @access Private
 */
resumeCheckRouter.get("/history", authMiddleware.authUser, resumeCheckController.getAllResumeChecksController)

/**
 * @route GET /api/resume/:checkId
 * @description Get specific ATS resume check report details
 * @access Private
 */
resumeCheckRouter.get("/:checkId", authMiddleware.authUser, resumeCheckController.getResumeCheckByIdController)

module.exports = resumeCheckRouter

const express=require("express")
const authMiddleware= require("../middlewares/auth.middleware")
const interViewRouter=express.Router()
const interviewController=require("../controller/interview.controller")
const upload=require("../middlewares/file.middleware")
/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description, resume pdf and job decription.
 * @access private
 */
interViewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterViewReportController)
/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by id
 * @access private
 */
interViewRouter.get("/report/:interviewId",authMiddleware.authUser,interviewController.getInterviewReportByController)

/**
 * @route GET /api/interview/
 */

interViewRouter.get("/",authMiddleware.authUser,interviewController.getAllInterviewReportsController)

/**
 * @route GET /api/interview/report/:interviewId/perfect-resume
 * @description Generate and download Perfect ATS Resume PDF
 * @access Private
 */
interViewRouter.get("/report/:interviewId/perfect-resume", authMiddleware.authUser, interviewController.downloadPerfectResumeController)

module.exports=interViewRouter
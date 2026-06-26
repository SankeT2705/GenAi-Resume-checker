const pdfparse=require("pdf-parse")
const generateInterviewReport=require("../services/ai.service")
const interviewReportModel=require("../models/interviewReport.model")
const { response } = require("../app")
/**
 * 
 */
async function generateInterViewReportController(req,res){
        const resumeFile=req.resumeFile
        const resumeContent=await (new pdfparse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        const {selfDescription, jobDescription}=req.body

        const interViewReportByAi= await generateInterviewReport({resume:resumeContent.text,selfDescription,jobDescription})

        const interviewReport= await interviewReportModel.create({
            user:req.user.id,
            resume:resumeContent.text,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })
        res.status(201).json({
            message:"Interview report generated successfully",
            interviewReport
        })
}
/**
 * @description Controller to get interview report by interviewId
 */
async function getInterviewReportByController(req,res){
    const {interviewId}=req.params
    const interviewReport=await interviewReportModel.findOne({_id:interviewId,user:req.user.id})
    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })
    }
    res.status(200).json({
        message:"Interview report fetched successfully",
        interviewReport
    })
}

async function getAllInterviewReportsController(req,res){
 const interviewReports=await interviewReportModel.find({user:req.user.id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
 res.status(200).json({
    message:"Interview report fetched successfully",
    interviewReports
 })
}
module.exports={generateInterViewReportController,getInterviewReportByController,getAllInterviewReportsController}
const mongoose = require("mongoose")

const typoSchema = new mongoose.Schema({
  issue: { type: String, required: true },
  suggestion: { type: String, required: true }
}, { _id: false })

const sectionAnalysisSchema = new mongoose.Schema({
  section: { type: String, required: true },
  status: { type: String, enum: ["Good", "Needs Improvement", "Missing"], required: true },
  feedback: { type: String, required: true }
}, { _id: false })

const resumeCheckSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  summary: {
    type: String,
    required: true
  },
  strongPoints: [{ type: String }],
  weakPoints: [{ type: String }],
  typosAndGrammar: [typoSchema],
  sectionAnalysis: [sectionAnalysisSchema],
  formattingAndDesign: [{ type: String }],
  actionableRecommendations: [{ type: String }]
}, {
  timestamps: true
})

const resumeCheckModel = mongoose.model("ResumeCheck", resumeCheckSchema)
module.exports = resumeCheckModel

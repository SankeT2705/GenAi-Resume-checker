const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches with the job description"),
  technicalQuestions: z.array(z.object({
    question: z.string().describe("The Technical question can be asked in the interview"),
    intention: z.string().describe("The intention of interviewer behind asking this question"),
    answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
  })).describe("Technical questions that can be asked in the interview along with intention and how to answer them"),
  behavioralQuestions: z.array(z.object({
    question: z.string().describe("The Behavioral question can be asked in the interview"),
    intention: z.string().describe("The intention of interviewer behind asking this question"),
    answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
  })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
  skillGaps: z.array(z.object({
    skill: z.string().describe("the skill which the candidate is lacking"),
    severity: z.enum(["Low", "Medium", "High"]).describe("The severity of this skill gap i.e how important is this skill for the job")
  })).describe("List of skill gaps in candidate's profile along with their severity"),
  preparationPlan: z.array(z.object({
    day: z.number().describe("The day number in the preparation plan, starting from 1"),
    focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design"),
    tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan")
  })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
  title: z.string().describe("The title of the job for which the interview report is generated")
})

const resumeAtsSchema = z.object({
  atsScore: z.number().describe("ATS compliance score between 0 and 100"),
  summary: z.string().describe("Overall assessment of the resume for ATS and recruiter impression"),
  strongPoints: z.array(z.string()).describe("List of strong points in the resume"),
  weakPoints: z.array(z.string()).describe("List of weak points or missing elements in the resume"),
  typosAndGrammar: z.array(z.object({
    issue: z.string().describe("Found spelling or grammar mistake or awkward phrasing"),
    suggestion: z.string().describe("Corrected version or suggestion")
  })).describe("Spelling, typos, and grammar feedback"),
  sectionAnalysis: z.array(z.object({
    section: z.string().describe("Name of the section (e.g. Contact Info, Summary, Experience, Skills, Education)"),
    status: z.enum(["Good", "Needs Improvement", "Missing"]).describe("Current status of this section"),
    feedback: z.string().describe("Detailed feedback and suggestions for this section")
  })).describe("Breakdown analysis by resume sections"),
  formattingAndDesign: z.array(z.string()).describe("Feedback regarding layout, font choices, bullet points, and ATS readability"),
  actionableRecommendations: z.array(z.string()).describe("Top actionable recommendations to improve ATS compatibility")
})

const perfectResumeSchema = z.object({
  name: z.string().describe("Candidate full name derived or assumed from resume"),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    linkedin: z.string(),
    github: z.string()
  }),
  professionalSummary: z.string().describe("Compelling, ATS-optimized 3-4 sentence professional summary tailored to the target job"),
  skills: z.array(z.object({
    category: z.string().describe("Skill category, e.g., Languages, Frameworks & Libraries, Tools & Databases, Soft Skills"),
    items: z.array(z.string())
  })),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    dates: z.string(),
    bulletPoints: z.array(z.string()).describe("Strong, action-verb led bullet points with quantifiable achievements matching target job keywords")
  })),
  projects: z.array(z.object({
    title: z.string(),
    techStack: z.string(),
    bulletPoints: z.array(z.string())
  })),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    dates: z.string(),
    details: z.string()
  }))
})

async function runGenAIWithFallback(prompt, schema) {
  const jsonSchema = zodToJsonSchema(schema);
  delete jsonSchema['$schema'];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: jsonSchema
      }
    });
    return JSON.parse(response.text);
  } catch (err) {
    console.warn("Primary model gemini-2.5-flash failed, trying fallback model gemini-2.0-flash...", err.message);
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: jsonSchema
        }
      });
      return JSON.parse(fallbackResponse.text);
    } catch (fallbackErr) {
      console.error("Fallback model gemini-2.0-flash also failed:", fallbackErr.message);
      throw new Error(`Google GenAI Service Error: ${fallbackErr.message}`);
    }
  }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate an interview report for a candidate with the following details:
Candidate Resume: ${resume}
Candidate Self Description: ${selfDescription}
Job Description: ${jobDescription}
Return ONLY a JSON object matching the requested schema.`;

  return await runGenAIWithFallback(prompt, interviewReportSchema);
}

async function analyzeResumeAts({ resumeText }) {
  const prompt = `Perform a thorough ATS (Applicant Tracking System) check and professional audit on the following resume content:
Resume Content: ${resumeText}
Evaluate typos, grammar, layout/formatting, section completeness, action verbs, and overall recruiter impression. Return ONLY a JSON object matching the schema.`;

  return await runGenAIWithFallback(prompt, resumeAtsSchema);
}

async function generatePerfectResumeData({ resumeText, selfDescription, jobDescription, skillGaps }) {
  const prompt = `You are a world-class executive resume writer. Generate an ultra-clean, modern, highly authentic HUMAN-LIKE ATS resume based on:
Original Resume: ${resumeText}
Candidate Self Description: ${selfDescription}
Target Job Description: ${jobDescription}
Identified Skill Gaps to address naturally: ${JSON.stringify(skillGaps || [])}

STRICT CONSTRAINTS FOR HUMAN-LIKE ATS RESUME:
1. CONTENT & TONE: Write in a natural, high-impact human professional voice. Avoid AI buzzwords (e.g., "spearheaded transformational synergies", "tapestry"). Keep bullet points concise and impactful (1-2 lines max per bullet).
2. CONCISE LENGTH: Keep the resume concise and easy to read. Do NOT flood with unnecessary text. 
   - Professional Summary: Exactly 2 to 3 concise sentences matching the target role.
   - Experience: Maximum 2 to 3 high-impact action-oriented bullet points per position.
   - Projects: Maximum 2 core relevant projects with 2 short bullet points each.
   - Skills: Group into 3 to 4 clear categories with relevant tools.
3. AUTHENTICITY: Seamlessly integrate missing skills matching the job description without fabricating fake jobs.

Return ONLY a JSON object matching the requested schema.`;

  return await runGenAIWithFallback(prompt, perfectResumeSchema);
}

module.exports = {
  generateInterviewReport,
  analyzeResumeAts,
  generatePerfectResumeData
};
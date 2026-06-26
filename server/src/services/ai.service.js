const { GoogleGenAI }= require("@google/genai")
const {z}=require("zod")
const { zodToJsonSchema }=require("zod-to-json-schema")
const ai = new GoogleGenAI({
    apiKey:process.env.GOOGLE_GENAI_API_KEY
});



const interviewReportSchema=z.object({
    matchScore:z.number().describe("A score between 0 and 100 indicating how well the candiate's profile matches with the job describe"),
    technicalQuestions:z.array(z.object({
        question:z.string().describe("The Technical question can be asked in the interview"),
        intention:z.string().describe("The intention of interview behind asking this question"),
        answer:z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with intention and how to answer them"),
    behavioralQuestions:z.array(z.object({
        question:z.string().describe("The Behavioral question can be asked in the interview"),
        intention:z.string().describe("The intention of interview behind asking this question"),
        answer:z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),

    skillGaps:z.array(z.object({
        skill:z.string().describe("the skill which the candidate is lacking"),
        severity:z.enum(["Low","Medium","High"]).describe("The severity of this skill gap i.e how important is this skill for the job")
    })).describe("List of skill gaps in candidate's profile along with theire severity"),
    preparationPlan:z.array(z.object({
        day:z.number().describe("The day number in the preparation plan, starting from 1"),
        focus:z.string().describe("The main focus of this day in the preparation plan, e.g.data structure, system design"),
        tasks:z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively "),
    title:z.string().describe("The title of the job for which the interview report is generated")
})
 
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
Candidate Resume: ${resume}
Candidate Self Description: ${selfDescription}
Job Description: ${jobDescription}
Return ONLY a JSON object with these fields.
Do not return any additional fields.`;

    // 1. Convert Zod to JSON Schema
    const jsonSchema = zodToJsonSchema(interviewReportSchema);
    
    // 2. Strip out the $schema key (Gemini's API will throw a 400 error if this is present)
    delete jsonSchema['$schema'];

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // 3. Use the correct property name
            responseSchema: jsonSchema 
        }
    });

    return JSON.parse(response.text)
}

module.exports = generateInterviewReport;
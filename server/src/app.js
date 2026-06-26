const express = require("express")
const cookieParser=require("cookie-parser")

const cors=require("cors")
const app=express()

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173"

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: corsOrigin,
    credentials:true
}))
const authRouter = require("./routes/auth.routes")
const interviewRouter=require("./routes/interview.routes")
/* Prefix for any api*/
app.use("/api/auth",authRouter)
app.use("/api/interview",interviewRouter)
module.exports=app
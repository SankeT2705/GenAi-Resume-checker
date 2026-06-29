const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const connectToDB = require("./config/database")

const app = express()

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map(url => url.trim())

if (process.env.NODE_ENV !== "production") {
  ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"].forEach(origin => {
    if (!allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin)
    }
  })
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || process.env.NODE_ENV !== "production") {
      return callback(null, true)
    }
    return callback(null, origin)
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// Root route check
app.get("/", (req, res) => {
  res.status(200).json({ message: "AI Resume & Interview Analyzer Backend is running successfully!" })
})

// Ensure database is connected on serverless request (skipping preflight OPTIONS)
app.use(async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }
  try {
    await connectToDB()
    next()
  } catch (err) {
    console.error("DB Middleware Error:", err)
    res.status(500).json({ message: "Database connection failed", error: err.message })
  }
})

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const resumeCheckRouter = require("./routes/resumeCheck.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/resume", resumeCheckRouter)

module.exports = app
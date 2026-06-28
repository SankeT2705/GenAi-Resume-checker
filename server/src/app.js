const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const connectToDB = require("./config/database")

const app = express()

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map(url => url.trim())

// Add default local origins if in development
if (process.env.NODE_ENV !== "production") {
  ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"].forEach(origin => {
    if (!allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin)
    }
  })
}

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes("*") || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
      return callback(null, true)
    }
    return callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

// Ensure database is connected on every serverless request
app.use(async (req, res, next) => {
  try {
    await connectToDB()
    next()
  } catch (err) {
    res.status(500).json({ message: "Database connection failed", error: err.message })
  }
})

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

module.exports = app
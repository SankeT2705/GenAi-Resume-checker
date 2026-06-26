require("dotenv").config()
const app = require("../server/src/app")
const connectToDB = require("../server/src/config/database")

// Connect to database on cold start
connectToDB()

// Export for Vercel
module.exports = app

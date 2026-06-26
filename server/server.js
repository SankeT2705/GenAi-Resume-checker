require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

// Connect to database (don't wait for it to complete)
connectToDB().catch(err => {
  console.error("Database connection error:", err)
})

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV}`)
  })
}

// Export for Vercel
module.exports = app
require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  connectToDB().catch(err => {
    console.error("Database connection error:", err)
  })
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV}`)
  })
}

module.exports = (req, res) => {
  return app(req, res)
}
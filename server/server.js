require("dotenv").config()
const app =require("./src/app")
const connectToDB=require("./src/config/database")
const invokeGeminiAi= require("./src/services/ai.service")
 
connectToDB()

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
import express from "express"
import dotenv from "dotenv"
import connectDB from "./src/db/db.js"

const app = express()

dotenv.config({
    path:"./.env"
});

const PORT = process.env.PORT

app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running on port http://localhost:${PORT}`)
})
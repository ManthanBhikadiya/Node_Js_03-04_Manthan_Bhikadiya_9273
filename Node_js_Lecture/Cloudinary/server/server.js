import express from 'express'
import router from './routes/file.routes.js'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './db/db.js'

const app = express()

const port = 3020

dotenv.config({
  path:"./.env"
})

// middleware

app.use(cors({
  origin:process.env.FRONTEND_URL || '*'
}))


// routes
app.use('/upload' , router)

app.get('/' , (req , res) => {
  res.send("Hello Cloudinary!")
})

connectDB();

app.listen(port , () => {
  console.log("server start on port 3020");
})
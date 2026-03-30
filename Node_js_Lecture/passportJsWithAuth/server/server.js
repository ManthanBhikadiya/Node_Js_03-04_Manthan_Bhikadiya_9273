import express from 'express'
import dotenv from 'dotenv'
import connectDB from './src/db/db.js'
import cors from 'cors'
import helmet from 'helmet'
import session from 'express-session'
import morgan from 'morgan'
import passport from 'passport'
import mongoose from 'mongoose'
import authRoutes from './src/routes/auth.routes.js'
import apiRoutes from './src/routes/api.routes.js'


const app = express()

dotenv.config({
  path:"./.env"
})

// middleware
app.use(helmet());
app.use(morgan('dev'))
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// session

app.use(session({
  secret:process.env.SESSION_SECRET || 'secret-key',
  saveUninitialized:false,
  cookie:{secure:false , maxAge:24 * 60 * 60 * 1000}
}))

// passport init

app.use(passport.initialize())
app.use(passport.session())

// Routes

app.use('/auth' , authRoutes)
app.use('/api' , apiRoutes)

const PORT = process.env.PORT

app.listen(PORT , () => {
  connectDB()
  console.log(`Server start on http://localhost:${PORT}`);
})





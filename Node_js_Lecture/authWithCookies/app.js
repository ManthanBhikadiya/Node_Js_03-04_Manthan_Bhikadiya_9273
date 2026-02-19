import express from "express"
import dotevn from "dotenv"
import mongoose, { mongo } from "mongoose"
import cookieParser from "cookie-parser"

dotevn.config({
    path: './.env'
})

const app = express()

const port = process.env.PORT

mongoose.connect(process.env.MONGO_URL).then(() => console.log('mongoDB connected')).catch((err)=>console.error('MongoDB Error:', err))

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser('lecture-auth-2026'))

app.listen(port,()=>{
    console.log(`server start at port ${port}`)
})
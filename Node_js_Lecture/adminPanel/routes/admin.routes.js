import express from 'express'


const adminRoutes = express.Router()

adminRoutes.get('/dashboard' , (req , res) => {
  res.render('dashboard')
})

adminRoutes.get('/form' , (req ,res) => {
  res.render('form')
})

adminRoutes.get('/table' , (req , res) => {
  const users = [
    {name:"John" , email:"john@gmail.com"},
    {name:"Vecter" , email:"Vecter@gmail.com"}
  ]
  res.render('table' , {users})
})

export default adminRoutes
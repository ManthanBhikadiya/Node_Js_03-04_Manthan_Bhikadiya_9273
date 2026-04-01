import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Login from './Components/Login'
import Register from './Components/Register'
import Profile from './pages/profile'
import { useState, useEffect } from 'react'

function App() {

  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (!token) return new Error("Access Denied...")
    if (token) {
      localStorage.setItem("token", token)
      window.location.replaceState({}, '', '/profile')
      navigate("/profile")
    }
  })


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<h1>Welcome</h1>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './pages/profile'
import Navbar from './components/Navbar'
import { useEffect } from 'react'

function TokenHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem("token", token)
      window.history.replaceState({}, '', '/profile')
      navigate("/profile")
    }
  }, [navigate])

  return null
}

function App() {
  return (
    <>
      <BrowserRouter>
        <TokenHandler />
        <Routes>
          <Route path='/' element={<Navbar/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

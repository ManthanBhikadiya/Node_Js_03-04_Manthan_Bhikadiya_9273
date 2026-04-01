import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post("http://localhost:3002/auth/login", { email, password })

            localStorage.setItem('token', res.data.token || ' ');

            navigate("/profile")
        } catch (err) {
            alert(err.response?.data?.message || "Login failed")
        }
    }

    return (
        <>
            <div>Login Page</div>
            <form onSubmit={handleLogin}>
                <h2>Login Form</h2>
                <input type="email" name="" id="email" value={email} onChange={(e) => setEmail(email.target.value)} required />
                <input type="password" name="" id="password" value={password} required onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Login</button>
            </form>
        </>
    )
}

export default Login
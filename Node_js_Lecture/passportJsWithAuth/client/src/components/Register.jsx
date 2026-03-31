import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {

    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post("http://localhost:3002/auth/register", { name, email, password })

            localStorage.setItem('token', res.data.token || ' ');

            navigate("/profile")
        } catch (err) {
            alert(err.response?.data?.message || "Register failed")
        }
    }

    return (
        <>
            <div>Register Page</div>
            <form onSubmit={handleRegister}>
                <h2>Register Form</h2>
                <input type="text" name="" id="name" value={name} onChange={(e) => setName(name.target.value)} required />
                <input type="email" name="" id="email" value={email} onChange={(e) => setEmail(email.target.value)} required />
                <input type="password" name="" id="password" value={password} required onChange={(e) => setPassword(e.target.value)} />
            </form>
        </>
    )
}

export default Register
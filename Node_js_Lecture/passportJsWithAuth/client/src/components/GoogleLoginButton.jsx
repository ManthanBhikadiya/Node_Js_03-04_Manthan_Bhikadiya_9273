import React from 'react'
import { useState } from 'react'

const GoogleLoginButton = () => {

    const [active, setActive] = useState(false)

    const handleLogin = () => {
        window.location.href = 'http://localhost:3002/auth/google'
    }

    return (
        <button style={{ backgroundColor: active ? "green" : "none", border: active ? "none" : "1px solid black" }} onClick={handleLogin}>Login with google</button>
    )
}

export default GoogleLoginButton
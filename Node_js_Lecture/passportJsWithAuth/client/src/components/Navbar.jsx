import React from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {

    const isLoggedIn = localStorage.getItem('token')

    return (
        <nav>
            <span>Home</span>
            {
                isLoggedIn ? (
                    <>
                        <span>Profile</span>
                        <button>Logout</button>
                    </>
                ) : (
                    <>
                        <button>Login</button>
                        <button>Register</button>
                    </>
                )
            }
        </nav>
    )
}

export default Navbar
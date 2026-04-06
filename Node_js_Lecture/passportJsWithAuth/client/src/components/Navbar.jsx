import React from 'react'
import { NavLink, Link } from 'react-router-dom'
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
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )
            }
        </nav>
    )
}

export default Navbar
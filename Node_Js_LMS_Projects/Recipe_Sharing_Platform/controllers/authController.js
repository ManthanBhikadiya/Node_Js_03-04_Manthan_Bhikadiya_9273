import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerPage = (req, res) => {
    res.render("register");
};

export const loginPage = (req, res) => {
    res.render("login");
};

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            req.flash("error_msg", "Username and password are required");
            return res.redirect("/register");
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash("error_msg", "User already exists");
            return res.redirect("/register");
        }

        await User.create({
            username,
            password
        });

        req.flash("success_msg", "Registration successful! Please login.");
        res.redirect("/login");
    } catch (err) {
        console.error("Registration Error:", err);
        req.flash("error_msg", `Server error during registration: ${err.message}`);
        res.redirect("/register");
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            req.flash("error_msg", "Username and password are required");
            return res.redirect("/login");
        }

        const user = await User.findOne({ username });

        if (!user) {
            req.flash("error_msg", "User Not Found");
            return res.redirect("/login");
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            req.flash("error_msg", "Wrong Password");
            return res.redirect("/login");
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET
        );

        res.cookie("token", token, { httpOnly: true });
        req.flash("success_msg", "Login successful!");
        res.redirect("/recipes");
    } catch (err) {
        console.error("Login Error:", err.message);
        req.flash("error_msg", "Server error during login");
        res.redirect("/login");
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
};
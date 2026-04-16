import { Admin } from "../model/admin-panel.model.js";
import bcrypt from "bcrypt";
import otpgenerator from "otp-generator";
import os from "os";
import sendEmail from "../middleware/sendEmail.js";

export const loginPage = (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id != undefined) {
            return res.redirect("/dashboard");
        } else {
            return res.render("login");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
};

export const loginWithAdmin = (req, res) => {
    try {
        res.clearCookie("user");
        return res.redirect("/");
    } catch (err) {
        console.log(err);
        res.redirect("/dashboard");
    }
};

export const dashboard = (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id != undefined) {
            const user = req.cookies.user;
            return res.render("dashboard", { user });
        } else {
            return res.redirect("/");
        }
    } catch (err) {
        console.log(err);
        res.redirect("/dashboard");
    }
};

export const profilePage = (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id != undefined) {
            const user = req.cookies.user;
            return res.render("profile", { user });
        } else {
            return res.redirect("/");
        }
    } catch (err) {
        console.log(err);
        res.redirect("/dashboard");
    }
};

export const changePasswordPage = (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id != undefined) {
            const user = req.cookies.user;
            return res.render("changepassword", { user });
        } else {
            return res.redirect("/");
        }
    } catch (err) {
        console.log(err);
        res.redirect("/dashboard");
    }
};

export const changePassword = async (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id != undefined) {
            const user = req.cookies.user;
            const { oldPass, newPassword, confirmPassword } = req.body

            let matchpass = await bcrypt.compare(oldPass, user.password)

            if (!matchpass) {
                return res.redirect("/change-password")
            }

            if (oldPass == newPassword) {
                return res.redirect("/change-password")
            }

            if (newPassword == confirmPassword) {
                return res.redirect("/change-password")
            }

            const hashPassword = await bcrypt.hash(newPassword, 10)

            Admin.findByIdAndUpdate(user._id, { passsword: hashPassword }, { new: true })

        } else {
            return res.redirect("/dashboard");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
};

export const loginUser = async (req, res) => {
    try {
        let admin = await Admin.findOne({ email: req.body.email })

        if (!admin) {
            console.log("Admin not found");
            return res.redirect("/")
        }
    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard")
    }
}

export const forgotPasswordPage = (req, res) => {
    try {
        return res.render("resetpass/verifyOtp")
    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard")
    }
}
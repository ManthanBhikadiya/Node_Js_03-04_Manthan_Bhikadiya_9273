import { Admin } from "../model/admin-panel.model.js";
import bcrypt from "bcrypt";
import otpgenerator from "otp-generator";
import os from "os";
import jwt from "jsonwebtoken";
import sendEmail from "../middleware/sendingEmail.js";

export const loginPage = (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id != undefined) {
            return res.redirect("/admin/dashboard");
        } else {
            return res.render("login");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("/admin/dashboard");
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

export const dashboard = async (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id != undefined) {
            const userFromCookie = req.cookies.user;
            const user = await Admin.findById(userFromCookie._id).lean();

            if (!user) {
                return res.redirect("/");
            }

            const totalAdmins = await Admin.countDocuments();
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const adminsThisWeek = await Admin.countDocuments({ createdAt: { $gte: oneWeekAgo } });
            const recentAdmins = await Admin.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            return res.render("admin/dashboard", {
                user,
                stats: {
                    totalAdmins,
                    adminsThisWeek
                },
                recentAdmins
            });
        } else {
            return res.redirect("/");
        }
    } catch (err) {
        console.log(err);
        res.redirect("/admin/dashboard");
    }
};

export const profilePage = (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id != undefined) {
            const user = req.cookies.user;
            return res.render("admin/profile", { user });
        } else {
            return res.redirect("/");
        }
    } catch (err) {
        console.log(err);
        res.redirect("/admin/dashboard");
    }
};

export const changePasswordPage = (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id != undefined) {
            const user = req.cookies.user;
            return res.render("admin/changePassword", { user });
        } else {
            return res.redirect("/");
        }
    } catch (err) {
        console.log(err);
        res.redirect("/admin/dashboard");
    }
};

export const changePassword = async (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id != undefined) {
            const user = req.cookies.user;
            const { oldPass, newPassword, confirmPassword } = req.body

            const admin = await Admin.findById(user._id)
            if (!admin) {
                return res.redirect("/admin/change-password")
            }

            let matchpass = await bcrypt.compare(oldPass, admin.password)

            if (!matchpass) {
                return res.redirect("/admin/change-password")
            }

            if (oldPass == newPassword) {
                return res.redirect("/admin/change-password")
            }

            if (newPassword != confirmPassword) {
                return res.redirect("/admin/change-password")
            }

            const hashPassword = await bcrypt.hash(newPassword, 10)

            await Admin.findByIdAndUpdate(user._id, { password: hashPassword }, { new: true })
            return res.redirect("/admin/profile")

        } else {
            return res.redirect("/admin/dashboard");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("/admin/dashboard");
    }
};

export const updateProfile = async (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id != undefined) {
            const user = req.cookies.user;
            const { firstname, lastname, email } = req.body;

            const updateData = {
                firstname: firstname || user.firstname,
                lastname: lastname || user.lastname,
                email: email || user.email,
            };

            const updatedAdmin = await Admin.findByIdAndUpdate(user._id, updateData, { new: true });

            if (updatedAdmin) {
                res.cookie("user", {
                    _id: updatedAdmin._id,
                    firstname: updatedAdmin.firstname,
                    lastname: updatedAdmin.lastname,
                    email: updatedAdmin.email
                }, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            }

            return res.redirect("/admin/profile");
        } else {
            return res.redirect("/admin/dashboard");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("/admin/dashboard");
    }
};

export const loginUser = async (req, res) => {
    try {
        console.log("Login attempt for email:", req.body.email);
        let admin = await Admin.findOne({ email: req.body.email })

        if (!admin) {
            console.log("Admin not found for email:", req.body.email);
            return res.redirect("/")
        }

        console.log("Admin found:", admin.email);
        const isMatch = await bcrypt.compare(req.body.password, admin.password)
        if (!isMatch) {
            console.log("Password mismatch for email:", req.body.email);
            return res.redirect("/")
        }

        console.log("Password matched for email:", req.body.email);
        const token = jwt.sign(
            { id: admin._id, email: admin.email },
            process.env.JWT_SECRET || "your_jwt_secret",
            { expiresIn: "1d" }
        );

        console.log("Setting cookie for user:", admin._id);
        res.cookie("user", {
            _id: admin._id,
            firstname: admin.firstname,
            lastname: admin.lastname,
            email: admin.email
        }, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        console.log("Redirecting to admin dashboard");
        return res.redirect("/admin/dashboard");
    } catch (err) {
        console.log("Error in loginUser:", err);
        return res.redirect("/dashboard")
    }
};

export const forgotPasswordPage = (req, res) => {
    try {
        return res.render("resetpass/forgotPassword")
    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard")
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.render("resetpass/forgotPassword", { error: "Email address not found", email });
        }

        const otp = otpgenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        admin.resetOtp = otp;
        admin.resetOtpExpiry = otpExpiry;
        await admin.save();

        await sendEmail(
            email,
            "Password Reset OTP",
            `Your OTP for password reset is: ${otp}. This OTP will expire in 10 minutes.`
        );

        res.render("resetpass/verifyotp", { email });
    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
};

export const verifyOtpPage = (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.redirect("/forgot-password");
        }
        res.render("resetpass/verifyotp", { email });
    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.redirect("/forgot-password");
        }

        if (admin.resetOtp !== otp) {
            return res.render("resetpass/verifyotp", { email, error: "Invalid OTP" });
        }

        if (admin.resetOtpExpiry < new Date()) {
            return res.render("resetpass/verifyotp", { email, error: "OTP has expired" });
        }

        res.render("resetpass/resetpassword", { email });
    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.redirect("/forgot-password");
        }

        if (password !== confirmPassword) {
            return res.render("resetpass/resetpassword", { email, error: "Passwords do not match" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        admin.password = hashPassword;
        admin.resetOtp = "";
        admin.resetOtpExpiry = undefined;
        await admin.save();

        res.redirect("/");
    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
};
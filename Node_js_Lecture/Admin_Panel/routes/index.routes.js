import express from "express";
import { loginPage, loginWithAdmin, dashboard, profilePage, changePasswordPage, changePassword, loginUser, forgotPasswordPage, forgotPassword, verifyOtpPage, verifyOtp, resetPassword } from "../controller/authcontroller.js";

const router = express.Router();

router.get("/", loginPage);
router.get("/logout", loginWithAdmin);
router.get("/dashboard", dashboard);
router.get("/profile", profilePage);
router.get("/change-password", changePasswordPage);
router.post("/change-password", changePassword);
router.post("/login", loginUser);

export default router;
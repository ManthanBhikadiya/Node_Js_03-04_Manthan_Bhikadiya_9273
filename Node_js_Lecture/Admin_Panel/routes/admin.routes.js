import express from "express";
import { addAdminPage, viewAllAdmin, addAdmin, deleteAdmin, getEditAdminPage, updateAdmin } from "../controller/controller.js";
import { dashboard, profilePage, changePasswordPage, changePassword, updateProfile } from "../controller/authcontroller.js";

const router = express.Router();

router.get("/dashboard", dashboard);
router.get("/profile", profilePage);
router.post("/profile", updateProfile);
router.get("/change-password", changePasswordPage);
router.post("/change-password", changePassword);
router.get("/add-admin", addAdminPage);
router.get("/view-admin", viewAllAdmin);
router.post("/add-admin", addAdmin);
router.get("/edit-admin/:id", getEditAdminPage);
router.post("/edit-admin/:id", updateAdmin);
router.post("/delete-admin/:id", deleteAdmin);

export default router;
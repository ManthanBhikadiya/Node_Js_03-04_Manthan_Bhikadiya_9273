import { Admin } from "../model/admin-panel.model.js"
import bcrypt from "bcrypt"
import path from "path"
import fs from "fs"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addAdminPage = async (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id != undefined) {
            const user = req.cookies.user;
            return res.render("admin/addAdmin", { user })
        } else return res.redirect("/")
    } catch (err) {
        console.log(err)
        return res.redirect("/dashboard")
    }
}

export const viewAllAdmin = async (req, res) => {
    try {
        let search = req.query.search ? req.query.search : "";
        let user = req.cookies.user
        let admin = await Admin.find({
            $or: [
                {
                    "firstname": { $regex: search, $options: "i" },
                    "lastname": { $regex: search, $options: "i" },
                }
            ]
        })
        return res.render("admin/viewAdmin", { admin, user })
    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard")
    }
}

export const addAdmin = async (req, res) => {
    try {
        // Handle file upload using multer
        req.upload.single('profileimage')(req, res, async (err) => {
            if (err) {
                console.log("File upload error:", err);
                return res.redirect("/admin/add-admin");
            }

            let imagepath = "";
            if (req.file) {
                imagepath = `/uploads/${req.file.filename}`;
            }

            let hashpassword = await bcrypt.hash(req.body.password, 10);

            let admin = await Admin.create({
                ...req.body,
                password: hashpassword,
                profileimage: imagepath
            });

            console.log("Admin Added Success");
            return res.redirect("/admin/add-admin");
        });
    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
};

export const deleteAdmin = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        if (admin.profileimage != "") {
            let imagePath = path.join(__dirname, '..', '..', 'public', admin.profileimage);
            try {
                await fs.unlinkSync(imagePath);
            } catch (err) {
                console.log(err);
            }
        }

        await Admin.findByIdAndDelete(admin.id);

        return res.status(200).json({ success: true, message: "Admin deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Error deleting admin" });
    }
};

export const getEditAdminPage = async (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user._id != undefined) {
            const user = req.cookies.user;
            const admin = await Admin.findById(req.params.id);
            if (!admin) {
                return res.redirect("/admin/view-admin");
            }
            return res.render("admin/editAdmin", { admin, user });
        } else {
            return res.redirect("/");
        }
    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
};

export const updateAdmin = async (req, res) => {
    try {
        req.upload.single('profileimage')(req, res, async (err) => {
            if (err) {
                console.log("File upload error:", err);
                return res.redirect("back");
            }

            const adminId = req.params.id;
            let updateData = { ...req.body };

            if (req.file) {
                const admin = await Admin.findById(adminId);
                if (admin && admin.profileimage) {
                    const oldImagePath = path.join(__dirname, '..', '..', 'public', admin.profileimage);
                    try {
                        await fs.unlinkSync(oldImagePath);
                    } catch (unlinkErr) {
                        console.log("Error deleting old image:", unlinkErr);
                    }
                }
                updateData.profileimage = `/uploads/${req.file.filename}`;
            } else {
                delete updateData.profileimage;
            }

            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }

            await Admin.findByIdAndUpdate(adminId, updateData, { new: true });
            return res.redirect("/admin/view-admin");
        });
    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard");
    }
};
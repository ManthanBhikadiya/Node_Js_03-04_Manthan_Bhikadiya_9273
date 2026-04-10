import { Admin } from "../model/admin-panel.model"
import bcrypt from "bcrypt"
import path from "path"
import fs from "fs"
import { cache } from "react"

export const addAdminPage = async (req, res) => {
    try {
        if (req.cookies && req.cookies.user && req.cookies.user_id != undefined) {
            return res.render("admin/addAdmin")
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
        return res.render("admin/viewAdmin")
    } catch (err) {
        console.log(err);
        return res.render("/dashboard")
    }
}

export const addAdmin = async (req, res) => {
    try {
        let imagepath = "";
        if (req.file) {
            imagepath = `/uploads/${req.file.filename}`
        }

        let hashpassword = await bcrypt.hash(req.body.password, 10)

        let admin = await Admin.create({
            ...req.body,
            password: hashpassword,
            profileImage: imagepath
        })

        console.log("Admin Added Success");

        return res.redirect("/admin/add-admin")

    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard")
    }
}

export const deleteAdmin = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id)

        if (!admin) {
            return res.redirect("/admin/view-admin")
        }

        if (admin.profileImage != "") {
            let imagePath = path.join(__dirname, ',,', admin.profileImage)
            try {
                await fs.unlinkSync(imagePath)
            } catch (err) {
                console.log(err);
            }
        }

        await Admin.findByIdAndDelete(admin.id)

        return res.redirect("/admin/view-admin")

    } catch (err) {
        console.log(err);
        return res.redirect("/dashboard")
    }
}
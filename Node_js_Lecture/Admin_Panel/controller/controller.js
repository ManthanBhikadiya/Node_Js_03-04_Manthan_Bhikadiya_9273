import { Admin } from "../model/admin-panel.model"
import bcrypt from "bcrypt"
import path from "path"
import fs from "fs"

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
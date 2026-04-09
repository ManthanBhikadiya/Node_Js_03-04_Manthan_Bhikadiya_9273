import mongoose from "mongoose";

const adminPanelSchema = new mongoose.Schema({
    firstname: {
        type: String
    },
    lastename: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    mobileno: {
        type: Number
    },
    profileimage: {
        type: String
    }
}, { timestamps: true })

export const Admin = mongoose.model("Admin", adminPanelSchema)
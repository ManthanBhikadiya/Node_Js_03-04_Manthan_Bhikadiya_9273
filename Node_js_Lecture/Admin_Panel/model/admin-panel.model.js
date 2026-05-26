import mongoose from "mongoose";

const adminPanelSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobileno: {
        type: String
    },
    profileimage: {
        type: String
    },
    resetOtp: {
        type: String
    },
    resetOtpExpiry: {
        type: Date
    }
}, { timestamps: true })

export const Admin = mongoose.model("Admin", adminPanelSchema)
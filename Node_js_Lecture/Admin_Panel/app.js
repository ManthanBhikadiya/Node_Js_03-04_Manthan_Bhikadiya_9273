import express from "express"
import cookieParser from "cookie-parser"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import multer from "multer"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'
import mongoose from "mongoose"
import indexRouter from "./routes/index.routes.js"
import adminRouter from "./routes/admin.routes.js"
import { Admin } from "./model/admin-panel.model.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

const uploadsDir = path.join(__dirname, 'public', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })

app.use((req, res, next) => {
  req.upload = upload
  next()
})

app.set("view engine", "ejs")

app.use("/uploads", express.static("uploads"))

app.use("/", indexRouter)
app.use("/admin", adminRouter)

const seedTestAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const email = process.env.ADMIN_EMAIL || "testadmin@example.com";
      const password = process.env.ADMIN_PASSWORD || "Admin@123";
      const firstname = process.env.ADMIN_FIRSTNAME || "Test";
      const lastname = process.env.ADMIN_LASTNAME || "Admin";
      const existing = await Admin.findOne({ email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await Admin.create({ firstname, lastname, email, password: hashedPassword });
        console.log(`Created default admin account: ${email} / ${password}`);
      }
    }
  } catch (err) {
    console.error("Error seeding default admin:", err);
  }
};

const startServer = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/adminpanel";
  const options = { serverSelectionTimeoutMS: 5000 };
  try {
    await mongoose.connect(uri, options);
    console.log("MongoDB Connected");
    await seedTestAdmin();
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    if (uri && uri.startsWith("mongodb") && uri.includes("//") && !uri.startsWith("mongodb://localhost")) {
      console.warn("Atlas connection failed. Check your IP whitelist or network settings. Trying local MongoDB fallback...");
      try {
        await mongoose.connect("mongodb://localhost:27017/adminpanel", options);
        console.log("Connected to local MongoDB fallback");
      } catch (err2) {
        console.error("Local MongoDB connection failed:", err2);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
};

startServer();
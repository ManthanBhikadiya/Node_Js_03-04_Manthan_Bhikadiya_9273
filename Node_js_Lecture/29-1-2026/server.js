import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import studentRoutes from "./routes/routes.students.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studentsDB";

mongoose
	.connect(MONGO_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
	res.send("Server is running");
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});


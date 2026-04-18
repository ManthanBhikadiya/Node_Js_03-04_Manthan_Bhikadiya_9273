import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import session from "express-session"
import MongoStore from "connect-mongo"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import itemRoutes from "./routes/itemRoutes.js"

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        }),
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

app.listen(process.env.PORT, () =>
    console.log(`Server running on ${process.env.PORT}`)
);
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET || "fallback_secret",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use("/", authRoutes);
app.use("/recipes", recipeRoutes);

app.listen(process.env.PORT, () => console.log(`http://localhost:${process.env.PORT}/login`));
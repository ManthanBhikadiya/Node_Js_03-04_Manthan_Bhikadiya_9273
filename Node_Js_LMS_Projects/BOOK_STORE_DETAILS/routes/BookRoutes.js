const express = require("express");
const router = express.Router();
const Book = require("../models/Book.js");

router.get("/", async (req, res) => {
  const books = await Book.find();
  res.render("index", { books });
});

router.get("/book/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("details", { book });
});

router.get("/search", async (req, res) => {
  const keyword = req.query.keyword || "";
  
  if (!keyword.trim()) {
    const books = await Book.find();
    return res.render("index", { books });
  }
  
  const books = await Book.find({
    title: { $regex: String(keyword), $options: "i" },
  });
  res.render("index", { books });
});

router.get("/admin", (req, res) => {
  res.render("admin-login");
});

router.post("/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.admin = true;
    res.redirect("/admin/dashboard");
  } else {
    res.send("Invalid Credentials");
  }
});

router.get("/admin/dashboard", async (req, res) => {
  if (!req.session.admin) return res.redirect("/admin");
  const books = await Book.find();
  res.render("admin-dashboard", { books });
});

router.get("/admin/add", (req, res) => {
  res.render("add-book");
});

router.post("/admin/add", async (req, res) => {
  await Book.create(req.body);
  res.redirect("/admin/dashboard");
});

router.get("/admin/edit/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("edit-book", { book });
});

router.post("/admin/edit/:id", async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/admin/dashboard");
});

router.get("/admin/delete/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect("/admin/dashboard");
});

module.exports = router;
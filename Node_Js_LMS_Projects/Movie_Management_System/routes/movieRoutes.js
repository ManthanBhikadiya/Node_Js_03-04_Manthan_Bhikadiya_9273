const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie.js");

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.render("index", { movies });
});

router.get("/movie/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.render("details", { movie });
});

router.get("/search", async (req, res) => {
  const keyword = req.query.keyword || "";
  
  if (!keyword.trim()) {
    const movies = await Movie.find();
    return res.render("index", { movies });
  }
  
  const movies = await Movie.find({
    title: { $regex: String(keyword), $options: "i" },
  });
  res.render("index", { movies });
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
  const movies = await Movie.find();
  res.render("admin-dashboard", { movies });
});

router.get("/admin/add", (req, res) => {
  res.render("add-movie");
});

router.post("/admin/add", async (req, res) => {
  await Movie.create(req.body);
  res.redirect("/admin/dashboard");
});

router.get("/admin/edit/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.render("edit-movie", { movie });
});

router.post("/admin/edit/:id", async (req, res) => {
  await Movie.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/admin/dashboard");
});

router.get("/admin/delete/:id", async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.redirect("/admin/dashboard");
});

module.exports = router;

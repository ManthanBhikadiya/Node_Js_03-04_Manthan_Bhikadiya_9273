const express = require("express");
const router = express.Router();
const {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
} = require("../controllers/blogController");

const auth = require('../middleware/authMiddleware');

router.get("/", getBlogs);
router.get("/:id", getBlogById);

router.post("/create", auth, createBlog);
router.put("/:id", auth, updateBlog);
router.delete("/:id", auth, deleteBlog);

module.exports = router;

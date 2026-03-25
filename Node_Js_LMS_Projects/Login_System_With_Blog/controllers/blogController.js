const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
    try {
        const blog = new Blog({
            ...req.body,
            createdBy: req.user.id
        });
        const savedBlog = await blog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        if (blog.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only edit your own blogs" });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        if (blog.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own blogs" });
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

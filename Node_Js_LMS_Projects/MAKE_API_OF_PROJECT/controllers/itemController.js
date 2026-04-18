import mongoose from "mongoose"
import Item from "../models/Item.js"

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createItem = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const item = await Item.create({
            title,
            description,
            user: req.session.userId,
        });

        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getItems = async (req, res) => {
    try {
        const items = await Item.find({ user: req.session.userId });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getItem = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "Invalid item ID" });
        }

        const item = await Item.findOne({ _id: req.params.id, user: req.session.userId });
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateItem = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "Invalid item ID" });
        }

        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const item = await Item.findOneAndUpdate(
            { _id: req.params.id, user: req.session.userId },
            { title, description },
            { new: true }
        );
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteItem = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: "Invalid item ID" });
        }

        const item = await Item.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
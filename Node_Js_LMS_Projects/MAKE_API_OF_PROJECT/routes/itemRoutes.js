import express from "express"
import auth from "../middleware/authMiddleware.js"
import {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem,
} from "../controllers/itemController.js"

const router = express.Router();

router.post("/", auth, createItem);
router.get("/", getItems);
router.get("/:id", getItem);
router.put("/:id", auth, updateItem);
router.delete("/:id", auth, deleteItem);

export default router;
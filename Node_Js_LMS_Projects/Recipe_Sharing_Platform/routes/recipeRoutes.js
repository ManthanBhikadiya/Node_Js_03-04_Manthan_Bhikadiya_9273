import express from "express";

import {
    getAllRecipes,
    myRecipes,
    recipeForm,
    addRecipe,
    getRecipeById,
    editRecipeForm,
    updateRecipe,
    deleteRecipe
} from "../controllers/recipeController.js";

import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", isAuth, getAllRecipes);
router.get("/my", isAuth, myRecipes);
router.get("/add", isAuth, recipeForm);
router.post("/add", isAuth, addRecipe);
router.get("/:id", isAuth, getRecipeById);
router.get("/edit/:id", isAuth, editRecipeForm);
router.put("/:id", isAuth, updateRecipe);
router.delete("/:id", isAuth, deleteRecipe);

export default router;
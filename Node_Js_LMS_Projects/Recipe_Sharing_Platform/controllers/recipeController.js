import Recipe from "../models/Recipe.js";
import User from "../models/User.js";

export const getAllRecipes = async (req, res) => {
    const recipes = await Recipe.find().populate("createdBy");
    res.render("recipeList", { recipes, user: req.user || null });
};

export const myRecipes = async (req, res) => {
    const recipes = await Recipe.find({
        createdBy: req.user.id
    });

    res.render("myRecipes", { recipes });
};

export const recipeForm = (req, res) => {
    res.render("recipeForm");
};

export const addRecipe = async (req, res) => {
    try {
        const { title, ingredients, steps } = req.body;

        if (!title || !ingredients || !steps) {
            req.flash("error_msg", "Title, ingredients, and steps are required");
            return res.redirect("/recipes/add");
        }

        const recipe = await Recipe.create({
            ...req.body,
            createdBy: req.user.id
        });

        await User.findByIdAndUpdate(req.user.id, {
            $push: { recipes: recipe._id }
        });

        req.flash("success_msg", "Recipe added successfully!");
        res.redirect("/recipes");
    } catch (err) {
        console.error("Error adding recipe:", err.message);
        req.flash("error_msg", "Server error while adding recipe");
        res.redirect("/recipes/add");
    }
};

export const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate("createdBy");
        
        if (!recipe) {
            req.flash("error_msg", "Recipe not found");
            return res.redirect("/recipes");
        }
        
        res.render("recipeItem", { recipe, user: req.user || null });
    } catch (err) {
        console.error("Error fetching recipe:", err.message);
        req.flash("error_msg", "Server error");
        res.redirect("/recipes");
    }
};

export const editRecipeForm = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate("createdBy");
        
        if (!recipe) {
            req.flash("error_msg", "Recipe not found");
            return res.redirect("/recipes");
        }
        
        if (recipe.createdBy._id.toString() !== req.user.id) {
            req.flash("error_msg", "Access denied");
            return res.redirect("/recipes");
        }
        
        res.render("recipeEdit", { recipe });
    } catch (err) {
        console.error("Error fetching recipe for edit:", err.message);
        req.flash("error_msg", "Server error");
        res.redirect("/recipes");
    }
};

export const updateRecipe = async (req, res) => {
    try {
        const { title, ingredients, steps } = req.body;
        
        if (!title || !ingredients || !steps) {
            req.flash("error_msg", "Title, ingredients, and steps are required");
            return res.redirect(`/recipes/edit/${req.params.id}`);
        }
        
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            req.flash("error_msg", "Recipe not found");
            return res.redirect("/recipes");
        }
        
        if (recipe.createdBy.toString() !== req.user.id) {
            req.flash("error_msg", "Access denied");
            return res.redirect("/recipes");
        }
        
        recipe.title = title;
        recipe.ingredients = ingredients;
        recipe.steps = steps;
        if (req.body.image) {
            recipe.image = req.body.image;
        }
        
        await recipe.save();
        
        req.flash("success_msg", "Recipe updated successfully!");
        res.redirect("/recipes");
    } catch (err) {
        console.error("Error updating recipe:", err.message);
        req.flash("error_msg", "Server error while updating recipe");
        res.redirect(`/recipes/edit/${req.params.id}`);
    }
};

export const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            req.flash("error_msg", "Recipe not found");
            return res.redirect("/recipes");
        }
        
        if (recipe.createdBy.toString() !== req.user.id) {
            req.flash("error_msg", "Access denied");
            return res.redirect("/recipes");
        }
        
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { recipes: recipe._id }
        });
        
        await Recipe.findByIdAndDelete(req.params.id);
        
        req.flash("success_msg", "Recipe deleted successfully!");
        res.redirect("/recipes");
    } catch (err) {
        console.error("Error deleting recipe:", err.message);
        req.flash("error_msg", "Server error while deleting recipe");
        res.redirect("/recipes");
    }
};


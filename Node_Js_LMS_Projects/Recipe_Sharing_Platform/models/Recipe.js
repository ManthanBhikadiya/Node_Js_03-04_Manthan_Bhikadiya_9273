import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    title: String,
    ingredients: String,
    steps: String,
    image: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

export default mongoose.model("Recipe", recipeSchema);
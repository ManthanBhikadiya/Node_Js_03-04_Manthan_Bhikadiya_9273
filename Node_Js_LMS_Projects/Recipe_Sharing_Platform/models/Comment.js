import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe"
    }
});

export default mongoose.model("Comment", commentSchema);
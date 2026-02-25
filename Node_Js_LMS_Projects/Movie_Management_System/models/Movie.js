const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: String,
    director: String,
    genre: String,
    releaseYear: Number,
    rating: Number,
    image: String,
    description: String,
});

module.exports = mongoose.model("Movie", movieSchema);

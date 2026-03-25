const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

connectDB();

app.use('/api/auth', require('./routes/authRoutes'));

const blogRoutes = require("./routes/blogRoutes");
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

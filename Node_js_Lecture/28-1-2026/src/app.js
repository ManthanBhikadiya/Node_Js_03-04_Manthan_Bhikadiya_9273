const express = require('express');
const path = require('path');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use('/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found', success: false });
});

// Error handling middleware (must be last)
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status || 500).json({
        message: error.message || 'An error occurred',
        success: false
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
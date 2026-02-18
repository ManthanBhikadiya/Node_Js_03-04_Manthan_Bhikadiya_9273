const express = require('express');
const upload = require('../middleware/multer');
const UploadController = require('../controllers/uploadController');

const router = express.Router();
const uploadController = new UploadController();

// Error handling middleware for multer
router.post('/upload', (req, res, next) => {
    upload.single('file')(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                message: error.message || 'File upload error',
                success: false
            });
        }
        next();
    });
}, uploadController.handleUpload);

module.exports = router;
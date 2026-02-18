class UploadController {
    handleUpload = (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                message: 'No file uploaded.',
                success: false
            });
        }
        res.status(200).json({
            message: 'File uploaded successfully.',
            success: true,
            file: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    }
}

module.exports = UploadController;
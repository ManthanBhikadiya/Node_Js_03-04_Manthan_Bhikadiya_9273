const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get absolute uploads directory path
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage options for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp to the original file name
  }
});

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  const allowedMimes = /image\/(jpeg|jpg|png|gif)/; // Allowed MIME types
  const allowedExts = /jpeg|jpg|png|gif/; // Allowed file extensions
  const mimetype = allowedMimes.test(file.mimetype); // Check MIME type
  const extname = allowedExts.test(file.originalname.split('.').pop().toLowerCase()); // Check file extension

  if (extname && mimetype) {
    return cb(null, true); // Accept file
  }
  cb(new Error('File type not allowed')); // Reject file
};

// Initialize Multer with storage and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: fileFilter
});

module.exports = upload;
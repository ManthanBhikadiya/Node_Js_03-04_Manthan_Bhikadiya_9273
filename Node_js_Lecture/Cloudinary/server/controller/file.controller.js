import fileUpload from '../models/file.models.js'

export const uploadFile = async (req, res) => {
  try {

    console.log('🔍 req.file received:', req.file);
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const {
      originalname,
      path: url,
      filename: public_id,
      format,
      bytes: size,
      mimetype
    } = req.file;

    const fileDoc = await fileUpload.create({
      originalName: originalname,
      url,
      public_id,
      format: format || mimetype.split('/')[1],
      mimetype
    });

    return res.json({
      message: 'File uploaded successfully (Cloudinary)',
      file: {
        id: fileDoc._id,
        originalName: fileDoc.originalName,
        url: fileDoc.url,
        public_id: fileDoc.public_id,
        format: fileDoc.format,
        size: fileDoc.size
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
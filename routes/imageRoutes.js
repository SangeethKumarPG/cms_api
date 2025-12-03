const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadImage, getImages, deleteImage } = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/:sitename/upload/:section', authMiddleware, upload.array('images',10), uploadImage);
router.get('/:sitename/images/:section', getImages);
router.delete('/:sitename/:section/:imageId', authMiddleware, deleteImage);

module.exports = router;
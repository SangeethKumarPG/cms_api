const express = require('express');
const { upload } = require('../config/multer');
const { uploadImage, getImages, deleteImage } = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:sitename/upload/:section', authMiddleware, upload.array('images', 10), uploadImage);
router.get('/:sitename/images/:section', getImages);
router.delete('/:sitename/:section/:imageId', authMiddleware, deleteImage);

module.exports = router;

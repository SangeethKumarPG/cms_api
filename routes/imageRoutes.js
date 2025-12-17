const express = require('express');
const upload = require('../config/multer'); 
const {
  uploadImage,
  getImages,
  deleteImage
} = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Upload images to S3
router.post(
  '/:sitename/upload/:section',
  authMiddleware,
  upload.array('images', 10),
  uploadImage
);

// Get images
router.get(
  '/:sitename/images/:section',
  getImages
);

// Delete image from S3
router.delete(
  '/:sitename/:section/:imageId',
  authMiddleware,
  deleteImage
);

module.exports = router;

const Site = require("../models/Site");
const Image = require("../models/Image");
const { uploadToS3, deleteFromS3 } = require("../utils/s3");
const { SECTIONS } = require("../utils/constants");

/**
 * Upload images to S3
 */
exports.uploadImage = async (req, res) => {
  const { sitename, section } = req.params;

  if (!SECTIONS.includes(section)) {
    return res.status(400).json({ message: "Invalid section" });
  }

  const site = await Site.findByName(sitename);
  if (!site) {
    return res.status(404).json({ message: "Site not found" });
  }

  const hasAccess = await Site.hasAccess(req.user.id, site.id);
  if (!hasAccess) {
    return res.status(403).json({ message: "Unauthorized access to this site" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images uploaded" });
  }

  const uploadedImages = [];

  for (const file of req.files) {
    // Upload to S3
    const { key, url } = await uploadToS3(
      file,
      `${sitename}/${section}`
    );

    // Save in DB
    await Image.insert(
      site.id,
      section,
      file.originalname,
      key,
      req.user.id
    );

    uploadedImages.push({ url });
  }

  res.json({
    message: "Images uploaded successfully",
    uploaded: uploadedImages,
  });
};

/**
 * Get images
 */
exports.getImages = async (req, res) => {
  const { sitename, section } = req.params;

  const site = await Site.findByName(sitename);
  if (!site) {
    return res.status(404).json({ message: "Site not found" });
  }

  const rows = await Image.findBySiteAndSection(site.id, section);

  const images = rows.map((img) => ({
    id: img.id,
    url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${img.s3_key}`,
    uploaded_at: img.uploaded_at,
  }));

  res.json(images);
};

/**
 * Delete image from S3 + DB
 */
exports.deleteImage = async (req, res) => {
  try {
    const { sitename, section, imageId } = req.params;

    if (!SECTIONS.includes(section)) {
      return res.status(400).json({ message: "Invalid section" });
    }

    const site = await Site.findByName(sitename);
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    const hasAccess = await Site.hasAccess(req.user.id, site.id);
    if (!hasAccess) {
      return res.status(403).json({ message: "Unauthorized access to this site" });
    }

    const image = await Image.findById(imageId);
    if (!image || image.site_id !== site.id || image.section !== section) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete from DB first (safer)
    await Image.delete(imageId);

    // Delete from S3
    await deleteFromS3(image.s3_key);

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

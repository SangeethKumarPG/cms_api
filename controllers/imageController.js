const Site = require("../models/Site");
const Image = require("../models/Image");
const fs = require("fs");
const path = require("path");
const { UPLOAD_DIR } = require("../config/multer");

exports.uploadImage = async (req, res) => {
  const { sitename, section } = req.params;

  if (!["hero", "main", "gallery", "features", "services"].includes(section)) {
    return res.status(400).json({ message: "Invalid section" });
  }

  const site = await Site.findByName(sitename);
  if (!site) return res.status(404).json({ message: "Site not found" });

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images uploaded" });
  }

  const uploadedImages = [];

  for (const file of req.files) {
    await Image.insert(site.id, section, file.filename, req.user.id);
    uploadedImages.push({
      filename: file.filename,
      url: `${process.env.IMAGE_BASE_URL}/${file.filename}`,
    });
  }

  res.json({
    message: "Images uploaded successfully",
    uploaded: uploadedImages,
  });
};

exports.getImages = async (req, res) => {
  const { sitename, section } = req.params;
  const site = await Site.findByName(sitename);
  if (!site) return res.status(404).json({ message: "Site not found" });

  const rows = await Image.findBySiteAndSection(site.id, section);
  const images = rows.map((img) => ({
    id: img.id,
    url: `${process.env.IMAGE_BASE_URL}/${img.filename}`,
    uploaded_at: img.uploaded_at,
  }));

  res.json(images);
};

exports.deleteImage = async (req, res) => {
  try {
    const { sitename, section, imageId } = req.params;

    if (!["hero", "main", "gallery", "features", "services"].includes(section)) {
      return res.status(400).json({ message: "Invalid section" });
    }

    const site = await Site.findByName(sitename);
    if (!site) return res.status(404).json({ message: "Site not found" });

    const image = await Image.findById(imageId);
    if (!image || image.site_id !== site.id || image.section !== section) {
      return res.status(404).json({ message: "Image not found" });
    }

    await Image.delete(imageId);

    const filePath = path.join(UPLOAD_DIR, image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

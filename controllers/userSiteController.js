const db = require("../config/db");
const User = require("../models/User");
const Site = require("../models/Site");

exports.mapUserToSite = async (req, res) => {
  const { user_id, site_id, role = "editor" } = req.body;

  if (!user_id || !site_id) {
    return res.status(400).json({
      message: "user_id and site_id are required",
    });
  }

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const site = await Site.findById(site_id);
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    const [existing] = await db.query(
      `
      SELECT * FROM user_site_access
      WHERE user_id = ? AND site_id = ?
      `,
      [user_id, site_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "User already mapped to this site",
      });
    }

    await db.query(
      `
      INSERT INTO user_site_access (user_id, site_id, role)
      VALUES (?, ?, ?)
      `,
      [user_id, site_id, role]
    );

    res.status(201).json({
      message: "User mapped to site successfully",
      mapping: {
        user_id,
        site_id,
        role,
        sitename: site.sitename,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

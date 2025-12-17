const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Site = require("../models/Site");
const db = require("../config/db");
const COOKIE_NAME = process.env.COOKIE_NAME || "token";

/* ----------------------------------------
   LOGIN
---------------------------------------- */
exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findByUsername(username);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // 🔹 1. Try to get site via user_site_access
  const [rows] = await db.query(
    `
    SELECT s.id, s.sitename, usa.role
    FROM user_site_access usa
    JOIN sites s ON s.id = usa.site_id
    WHERE usa.user_id = ?
    LIMIT 1
    `,
    [user.id]
  );

  // 🔹 2. Fallback: get default site if no mapping exists
  let site = rows[0];
  if (!site) {
    site = await Site.findDefaultSite(); // id + sitename
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      siteId: site?.id || null,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      site: site
        ? {
            id: site.id,
            sitename: site.sitename,
            role: site.role || "admin",
          }
        : null,
    },
  });
};
/* ----------------------------------------
   SIGNUP
---------------------------------------- */
exports.signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Signup successful",
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

/* ----------------------------------------
   LOGOUT
---------------------------------------- */
exports.logout = (req, res) => {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

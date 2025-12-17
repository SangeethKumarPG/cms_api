const express = require("express");
const router = express.Router();
const { mapUserToSite } = require("../controllers/userSiteController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/map", authMiddleware, mapUserToSite);

module.exports = router;

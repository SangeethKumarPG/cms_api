require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const siteRoutes = require("./routes/siteRoutes");
const imageRoutes = require("./routes/imageRoutes");
const userSiteRoutes = require("./routes/userSiteRoutes");

const app = express();

const allowedOrigins = [
  "https://cms.spensol.com",
  "https://bwdemo.spensol.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // ✅ THIS HANDLES PREFLIGHT SAFELY

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoutes);
app.use("/sites", siteRoutes);
app.use("/sites", imageRoutes);
app.use("/user-site", userSiteRoutes);

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

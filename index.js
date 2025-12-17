require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const siteRoutes = require("./routes/siteRoutes");
const imageRoutes = require("./routes/imageRoutes");

const app = express();

/* ----------------------------------------
   CORS CONFIG (FIXED)
---------------------------------------- */
const allowedOrigins = [
  "http://localhost:3000",
  "https://cms.spensol.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow REST tools & server-to-server calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Handle preflight requests
app.options(
  "*",
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* ----------------------------------------
   MIDDLEWARE ORDER (IMPORTANT)
---------------------------------------- */
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

/* ----------------------------------------
   ROUTES
---------------------------------------- */
app.use("/auth", authRoutes);
app.use("/sites", siteRoutes);
app.use("/sites", imageRoutes);

/* ----------------------------------------
   START SERVER
---------------------------------------- */
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const siteRoutes = require('./routes/siteRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/sites', siteRoutes);
app.use('/sites', imageRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
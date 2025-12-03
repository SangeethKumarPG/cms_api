const Site = require('../models/Site');
const db = require('../config/db');

exports.createSite = async (req, res) => {
  const { sitename } = req.body;
  try {
    const [result] = await db.query('INSERT INTO sites (sitename) VALUES (?)', [sitename]);
    res.status(201).json({ id: result.insertId, sitename });
  } catch (err) {
    res.status(500).json({ message: 'Error creating site' });
  }
};
const db = require('../config/db');

class Image {
  static async insert(site_id, section, filename, uploaded_by) {
    return db.query(
      'INSERT INTO images (site_id, section, filename, uploaded_by) VALUES (?, ?, ?, ?)',
      [site_id, section, filename, uploaded_by]
    );
  }

  static async findBySiteAndSection(site_id, section) {
    const [rows] = await db.query(
      'SELECT * FROM images WHERE site_id = ? AND section = ? ORDER BY id DESC',
      [site_id, section]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM images WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    return db.query('DELETE FROM images WHERE id = ?', [id]);
  }
}

module.exports = Image;

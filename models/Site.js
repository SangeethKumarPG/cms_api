const db = require('../config/db');

class Site {
  static async findByName(sitename) {
    const [rows] = await db.query('SELECT * FROM sites WHERE sitename=?', [sitename]);
    return rows[0];
  }
}

module.exports = Site;
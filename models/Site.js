const db = require("../config/db");

class Site {

  static async findByName(sitename) {
    const [rows] = await db.query(
      "SELECT * FROM sites WHERE sitename = ?",
      [sitename]
    );
    return rows[0];
  }


  static async findSitesByUserId(userId) {
    const [rows] = await db.query(
      `
      SELECT 
        s.id,
        s.sitename,
        usa.role
      FROM user_site_access usa
      JOIN sites s ON s.id = usa.site_id
      WHERE usa.user_id = ?
      `,
      [userId]
    );

    return rows;
  }

  static async hasAccess(userId, siteId) {
    const [rows] = await db.query(
      "SELECT 1 FROM user_site_access WHERE user_id = ? AND site_id = ?",
      [userId, siteId]
    );
    return rows.length > 0;
  }
  static async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM sites WHERE id = ?",
      [id]
    );
    return rows[0];
  }

}

module.exports = Site;

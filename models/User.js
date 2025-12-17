const db = require('../config/db');

class User {
  static async findByUsername(username) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async create({ username, password }) {
    const [result] = await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );

    return {
      id: result.insertId,
      username
    };
  }
  static async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  }

}

module.exports = User;

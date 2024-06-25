const db = require('../db'); 

class Flower {
  static async getAll() {
    const { rows } = await db.query('SELECT * FROM flowers');
    return rows;
  }

  static async getById(id) {
    const { rows } = await db.query('SELECT * FROM flowers WHERE id = $1', [id]);
    return rows[0];
  }

}
module.exports = Flower;
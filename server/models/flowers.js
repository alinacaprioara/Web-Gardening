const db = require('../../db'); 

class Flower {
  static async getAll() {
    const { rows } = db.query('SELECT * FROM flowers');
    return rows;
  }

}
module.exports = Flower;
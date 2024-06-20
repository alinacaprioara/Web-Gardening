const db = require('../../db');

class ShoppingCart {
  static async getAllItems() {
    const { rows } = db.query('SELECT * FROM shoppingCart');
    return rows;
  }
}
module.exports = ShoppingCart;
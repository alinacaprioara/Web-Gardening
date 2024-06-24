const db = require('../db');

const userController = {
    getUserById: async function(userId) {
        try {
            const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
            // console.log(result.rows[0]);
            return result.rows[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
};

module.exports = userController;
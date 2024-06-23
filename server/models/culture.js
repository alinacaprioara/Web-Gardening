const db = require('../../db'); 

class Culture {
    static async create({ userId, flowerId, quantity, price, senzors, details, photo }) {
        const result = await db.query(
            `INSERT INTO cultures (user_id, flower_id, quantity, price, details, photo, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id`,
            [userId, flowerId, quantity, price, details, photo]
        );
        const cultureId = result.rows[0].id;

        // if (senzors) {
        //     for (const senzor of senzors) {
        //         await db.query(
        //             `INSERT INTO sensorData (culture_id, ${senzor}, timestamp) 
        //              VALUES ($1, $2, CURRENT_TIMESTAMP)`,
        //             [cultureId, 0] 
        //         );
        //     }
        // }

        // if (photo) {
        //     const imageUrl = `/uploads/${photo.filename}`;
        //     await db.query(
        //         `INSERT INTO imageStream (culture_id, image_url, timestamp) 
        //          VALUES ($1, $2, CURRENT_TIMESTAMP)`,
        //         [cultureId, imageUrl]
        //     );
        // }

        return cultureId;
    }


    static async getAll() {
        const result = await db.query(`SELECT * FROM cultures`);
        return result.rows;
    }
}

module.exports = Culture;

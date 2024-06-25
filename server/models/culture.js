const db = require('../db'); 

class Culture {
    static async create({ userId, flowerId, quantity, price, details, photo, planting_date, expected_harvest_date}) {
        const result = await db.query(
            `INSERT INTO cultures (user_id, flower_id, quantity, price, details, photo, planting_date, expected_harvest_date, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id`,
            [userId, flowerId, quantity, price, details, photo, planting_date, expected_harvest_date]
        );
        const cultureId = result.rows[0].id;


        return cultureId;
    }


    static async getAll() {
        const query = `
            SELECT 
                cultures.id AS culture_id,
                cultures.user_id,
                cultures.flower_id,
                flowers.name AS flower_name,
                cultures.quantity,
                cultures.price,
                cultures.details,
                cultures.photo,
                cultures.planting_date,
                cultures.expected_harvest_date,
                cultures.created_at,
                cultures.updated_at
            FROM 
                cultures
            JOIN 
                flowers ON cultures.flower_id = flowers.id
        `;
        const { rows } = await db.query(query);
        return rows;
    }


    static async getByUserId(userId) {
        const query = `
            SELECT 
                cultures.id AS culture_id,
                cultures.user_id,
                cultures.flower_id,
                flowers.name AS flower_name,
                cultures.quantity,
                cultures.price,
                cultures.details,
                cultures.photo,
                cultures.planting_date,
                cultures.expected_harvest_date,
                cultures.created_at,
                cultures.updated_at
            FROM 
                cultures
            JOIN 
                flowers ON cultures.flower_id = flowers.id
            WHERE 
                cultures.user_id = $1
        `;
        const { rows } = await db.query(query, [userId]);
        return rows;
    }

    static async deleteById(id) {
        const query = `DELETE FROM cultures WHERE id = $1`;
        await db.query(query, [id]);
    }

    static async getFlowerId(cultureId) {
        const result = await pool.query('SELECT flower_id FROM cultures WHERE id = $1', [cultureId]);
        return result.rows[0];
    }
    

    static async updateSetReady(id) {
        const query = `UPDATE cultures SET ready = true WHERE id = $1`;
        await db.query(query, [id]);
    }
}

module.exports = Culture;

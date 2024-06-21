const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', 
  database: 'myPlant', 
  password: 'admin', 
  port: 5432, 
});

// pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'", (error, results) => {
//     if (error) {
//         throw error;
//     }
//     console.log(results.rows);
// });

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};

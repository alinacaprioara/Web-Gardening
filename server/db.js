const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', 
  database: 'myPlant', 
  password: 'admin', 
  port: 5432, 
});


module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  connect: () => {
    return pool.connect();
  }
};

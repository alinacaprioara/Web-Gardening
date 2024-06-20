
const db = require('./db'); 
async function testConnection() {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('Conexiunea la baza de date a fost realizata cu succes:');
    console.log(res.rows);
  } catch (err) {
    console.error('Eroare la conectarea la baza de date:');
    console.error(err);
  }
}

testConnection();

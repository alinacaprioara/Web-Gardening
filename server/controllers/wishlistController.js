const jwt = require('jsonwebtoken');
const db = require('../db');



async function getWishlist(req, res) {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, 'tigrut', async (err, decoded) => {
        if (err) {
            res.statusCode = 401;
            res.end('Unauthorized');
            return;
        }

        const userId = decoded.id;
        const wishlistItems = await db.query('SELECT * FROM purchaseInterest WHERE user_id = $1', [userId]);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ wishlistItems }));
    });
}

async function addProduct(req, res) {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, 'tigrut', async (err, decoded) => {
        if (err) {
            res.statusCode = 401;
            res.end('Unauthorized');
            return;
        }

        const userId = decoded.id;
        const { photo, price, cultureId } = req.body; 


        const existingProduct = await db.query('SELECT * FROM purchaseInterest WHERE user_id = $1 AND culture_id = $2', [userId, cultureId]);
        if (existingProduct.rows.length > 0) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'error', message: 'Product already in wishlist' }));
            return;
        }

        await db.query('INSERT INTO purchaseInterest (user_id, photo, price, culture_id) VALUES ($1, $2, $3, $4)', [userId, photo, price, cultureId]);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'success' }));
    });

}

async function deleteProduct(req, res) {
    console.log('req.body:', req.body);
    const itemId = req.body.itemId; 
    console.log('itemId:', itemId);

    let item;
    try {
        item = await db.query('SELECT * FROM purchaseInterest WHERE id = $1', [itemId]);
    } catch (error) {
        console.error('Error querying for item:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'error', message: 'An error occurred while querying for item'}));
        return;
    }

    if (!item || item.length === 0) {
        console.error('No item found with id:', itemId);
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'error', message: 'No item found with the provided id'}));
        return;
    }

    try {
        await db.query('DELETE FROM purchaseInterest WHERE id = $1', [itemId]);
    } catch (error) {
        console.error('Error deleting item:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'error', message: 'An error occurred while deleting item'}));
        return;
    }


    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({status: 'success', message: 'Item successfully deleted'}));
};



module.exports = {getWishlist, addProduct, deleteProduct}
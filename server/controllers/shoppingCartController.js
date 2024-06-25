const jwt = require('jsonwebtoken');
const db = require('../db');


async function addProduct(req, res) {
    const token = req.headers.authorization.split(' ')[1]; 

    const decoded = jwt.verify(token, 'tigrut'); 
    const userId = decoded.id;

    const { name, flowerId, quantity, photo, price, cultureId } = req.body; 
    if (flowerId === undefined || typeof flowerId !== 'number') {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'error', message: 'Invalid flowerId'}));
        return;
    }

    const cart = await db.query('SELECT id FROM shoppingCart WHERE id = $1', [userId]);

    if (cart.rowCount === 0) {
        await db.query('INSERT INTO shoppingCart (id, user_id, created_at, updated_at) VALUES ($1, $1, NOW(), NOW())', [userId]);
    }

    const cultureBeforeUpdate = await db.query('SELECT quantity FROM cultures WHERE id = $1', [cultureId]);
    console.log('Quantity before update:', cultureBeforeUpdate.rows[0].quantity);

    await db.query('UPDATE cultures SET quantity = quantity - $1 WHERE id = $2', [quantity, cultureId]);


    const cultureAfterUpdate = await db.query('SELECT quantity FROM cultures WHERE id = $1', [cultureId]);
    console.log('Quantity after update:', cultureAfterUpdate.rows[0].quantity);

    db.query('INSERT INTO shoppingCartItems (cart_id, flower_id, quantity, photo, price, culture_id, name) VALUES ($1, $2, $3, $4, $5, $6, $7)', [userId, flowerId, quantity, photo, price, cultureId, name])
    .then(() => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'success'}));
    })
    .catch(error => {
        console.error('Error:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'error', message: 'An error occurred'}));
    });

    
};


async function getShoppingCart(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.writeHead(401, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({status: 'error', message: 'No authorization header'}));
    }

    const token = authHeader.split(' ')[1]; 
    if (!token) {
        res.writeHead(401, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({status: 'error', message: 'No token provided'}));
    }

    let decoded;
    try {
        decoded = jwt.verify(token, 'tigrut');
    } catch (err) {
        res.writeHead(401, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify({status: 'error', message: 'Failed to decode token'}));
    }

    const userId = decoded.id;
    console.log('userId:', userId);

    db.query('SELECT shoppingCartItems.id as id, shoppingCartItems.cart_id, shoppingCartItems.flower_id, shoppingCartItems.quantity, shoppingCartItems.price, shoppingCartItems.photo, shoppingCartItems.name FROM shoppingCartItems LEFT JOIN flowers ON shoppingCartItems.flower_id = flowers.id WHERE shoppingCartItems.cart_id = $1', [userId])    .then(cartItems => {
        //console.log('cartItems:', cartItems); 
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'success', cartItems: cartItems}));
    })
    .catch(error => {
        console.error('Error:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'error', message: 'An error occurred'}));
    });
};

async function deleteProduct(req, res) {
    console.log('req.body:', req.body);
    const itemId = req.body.itemId; 
    console.log('itemId:', itemId);

    let item;
    try {
        item = await db.query('SELECT * FROM shoppingCartItems WHERE id = $1', [itemId]);
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

    const quantity = item.rows[0].quantity;
    console.log('quantity:', quantity);

    try {
        await db.query('DELETE FROM shoppingCartItems WHERE id = $1', [itemId]);
    } catch (error) {
        console.error('Error deleting item:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'error', message: 'An error occurred while deleting item'}));
        return;
    }

    try {
        await db.query('UPDATE cultures SET quantity = quantity + $1 WHERE id = $2', [quantity, item.rows[0].culture_id]);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'success', message: 'Item deleted'}));
    } catch (error) {
        console.error('Error updating culture quantity:', error);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'error', message: 'An error occurred while updating culture quantity'}));
    }
};

module.exports = {addProduct, getShoppingCart, deleteProduct};
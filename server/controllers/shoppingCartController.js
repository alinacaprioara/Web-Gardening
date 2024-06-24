const jwt = require('jsonwebtoken');
const db = require('../db');


async function addProduct(req, res) {
    const token = req.headers.authorization.split(' ')[1]; 

    const decoded = jwt.verify(token, 'tigrut'); 
    const userId = decoded.id;

    const { flowerId, quantity, photo, price } = req.body; 
    if (flowerId === undefined || typeof flowerId !== 'number') {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'error', message: 'Invalid flowerId'}));
        return;
    }

    const cart = await db.query('SELECT id FROM shoppingCart WHERE id = $1', [userId]);

    if (cart.rowCount === 0) {
        await db.query('INSERT INTO shoppingCart (id, user_id, created_at, updated_at) VALUES ($1, $1, NOW(), NOW())', [userId]);
    }

    db.query('INSERT INTO shoppingCartItems (cart_id, flower_id, quantity, photo, price) VALUES ($1, $2, $3, $4, $5)', [userId, flowerId, quantity, photo, price])
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

    db.query('SELECT * FROM shoppingCartItems JOIN flowers ON shoppingCartItems.flower_id = flowers.id WHERE shoppingCartItems.cart_id = $1', [userId])    .then(cartItems => {
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

module.exports = {addProduct, getShoppingCart};
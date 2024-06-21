const Culture = require('../models/culture');
const path = require('path');
const fs = require('fs');



async function addFlowerCulture(req, res) {
    const { flowerId, flower_price, quantity, senzors, details, photo } = req.body;
    const userId = req.user.id;

    try {
        const cultureId = await Culture.create({
            userId,
            flowerId,
            flower_price,
            quantity,
            senzors: Array.isArray(senzors) ? senzors : [senzors],
            details,
            photo: photo ? photo : null 
        });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ cultureId }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

module.exports = {
    addFlowerCulture
};
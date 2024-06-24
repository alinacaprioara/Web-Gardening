const Culture = require('../models/culture');
const path = require('path');
const fs = require('fs');
const { get } = require('http');


async function addFlowerCulture(req, res) {
    const {  flowerId, quantity, price, senzors, details, photo } = req.body;
    const userId = req.user.id;

    try {
        const cultureId = await Culture.create({
            userId,
            flowerId, 
            quantity, 
            price, 
            senzors: Array.isArray(senzors) ? senzors : [senzors], 
            details, 
            photo  
        });

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ cultureId }));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}



async function getAllCultures(req, res) {
    try {
        const cultures = await Culture.getAll();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cultures));
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}


const getCulturesByUserId = async (req, res) => {

    const userId = req;
     
    console.log('useeeeeeer id: '+userId);
    try {
        const cultures = await Culture.getByUserId(userId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cultures));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch cultures for user' }));
    }
};


module.exports = {
    addFlowerCulture,
    getAllCultures,
    getCulturesByUserId
};
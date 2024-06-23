const Culture = require('../models/culture');
const path = require('path');
const fs = require('fs');
const { get } = require('http');


async function addFlowerCulture(req, res) {
    const {  flowerId, quantity, price, senzors, details, photo } = req.body;
    console.log("recevied body addFlowerCulture:");
    console.log(req.body);
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

module.exports = {
    addFlowerCulture,
    getAllCultures
};
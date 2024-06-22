const Culture = require('../models/culture');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'uploads/flowers');
        },
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }),
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).single('photo');

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

module.exports = {
    addFlowerCulture
};
const Culture = require('../models/culture');
const Flower = require('../models/flowers');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');


const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

async function addFlowerCulture(req, res) {
    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Error processing form');
            return;
        }

        const { flower_name, flower_price, quantity, senzors, details } = fields;
        const userId = req.user.id; 
        try {

            const flowerResult = await Flower.create({ name: flower_name, price: flower_price, quantity, details });
            const flowerId = flowerResult.id;

            const cultureId = await Culture.create({
                userId,
                flowerId,
                senzors: Array.isArray(senzors) ? senzors : [senzors],
                details,
                photo: files.photo
            });

            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end(`Culture added with ID: ${cultureId}`);
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    });
}

module.exports = {
    addFlowerCulture
};

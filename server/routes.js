const url = require('url');
const fs = require('fs');
const cultureController = require('./controllers/cultureController');
const authController = require('./controllers/authController');
const flowerController = require('./controllers/flowerController');

const routes = {
    'GET': {
        '/flowers': flowerController.getFlowers,
        '/protected': (req, res) => {
            authController.authentificateToken(req, res, () => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Successfully accessed the protected route!' }));
            });
        },
    },
    'POST': {
        '/auth': (req, res) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                req.body = JSON.parse(body);
                authController.authentificate(req, res);
            });
        },
        '/register': (req, res) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                req.body = JSON.parse(body);
                authController.register(req, res);
            });
        },
        '/cultures': (req, res) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                req.body = JSON.parse(body);
                cultureController.addFlowerCulture(req, res);
            });
        },
    },
};

function handleRoute(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    const routeHandler = routes[method] && routes[method][pathname];

    const protectedRoutes = ['/flowers', '/cultures']; 


    if (routeHandler) {
        if (protectedRoutes.includes(pathname)) {
            authController.authentificateToken(req, res, () => {
                routeHandler(req, res);
            });
        } else {
            routeHandler(req, res);
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

module.exports = handleRoute;

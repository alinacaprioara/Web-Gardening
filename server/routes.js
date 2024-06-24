const url = require('url');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cultureController = require('./controllers/cultureController');
const authController = require('./controllers/authController');
const flowerController = require('./controllers/flowerController');
const userController = require('./controllers/userController');
const shoppingCartController = require('./controllers/shoppingCartController');
const authentificateToken = require('./middleware/authentificateToken');


const routes = {
    'GET': {
        '/flowers': (req, res) => {
            const token = req.headers['authorization'].split(' ')[1];
            if (!token) {
                res.statusCode = 401;
                res.end('Unauthorized');
                return;
            }
        
            flowerController.getFlowers(req, res);
        },
        '/cultures': (req, res) => {
            const token = req.headers['authorization'].split(' ')[1];
            if (!token) {
                res.statusCode = 401;
                res.end('Unauthorized');
                return;
            }
            cultureController.getAllCultures(req, res);
        },
        '/user': (req, res) => {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'No token provided' }));
                return;
            }

            jwt.verify(token, "tigrut", (err, decoded) => {
                //console.log(decoded)
                if (err) {
                    res.writeHead(403, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to authenticate token' }));
                    return;
                }

                //console.log(decoded.id);

                userController.getUserById(decoded.id)
                    .then(user => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(user));
                    })
                    .catch(err => {
                        console.error(err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'An error occurred while fetching the user\'s details' }));
                    });
            });
        },
        '/shoppingCart': (req, res) => {
            const token = req.headers['authorization'].split(' ')[1];
            if (!token) {
                res.statusCode = 401;
                res.end('Unauthorized');
                return;
            }
            shoppingCartController.getShoppingCart(req, res);
        }
        
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
        '/change-password': (req, res) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                req.body = JSON.parse(body);
                authController.changePassword(req, res);
            });
        },
        '/shoppingCart': (req, res) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                req.body = JSON.parse(body);
                shoppingCartController.addProduct(req, res);
            });
        }
    },
};

function handleRoute(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    const routeHandler = routes[method] && routes[method][pathname];

    const protectedRoutes = ['/flowers', '/cultures', '/user', '/change-password', '/shoppingCart']; 


    if (routeHandler) {
        if (protectedRoutes.includes(pathname)) {
            authentificateToken(req, res, () => {
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

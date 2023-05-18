let http = require('http');

let url = require('url');

let fs = require('fs');

let qs = require('qs');

let server = http.createServer((req, res) => {
    let parseUrl = url.parse(req.url);
    let path = parseUrl.pathname;
    let trimPath = path.replace(/^\/+|\/+$/g, '');
    if (req.method === 'GET') {
        let chosenHandler = (typeof (router[trimPath]) !== 'undefined') ? router[trimPath] : handlers.notFound;
        chosenHandler(req, res);
    } else {
        let chosenHandler = router.profile;
        chosenHandler(req, res);
    }
});

server.listen(3000, function () {
    console.log("http://localhost:3000");
});

let handlers = {};
handlers.home = (req, res) => {
    fs.readFile('./view/home.html', 'utf-8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
};
handlers.login = (req, res) => {
    fs.readFile('./view/login.html', 'utf-8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
};

handlers.notFound = (req, res) => {
    fs.readFile('./view/notfound.html', 'utf-8', (err, data) => {
        res.writeHead(404);
        res.write(data);
        res.end();
    });
};
handlers.profile = (req, res) => {
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    req.on('end', () => {
        data = qs.parse(data);
        let name = data.name;
        let stringObject = `<h1>Hello ${name}</h1>`;
        fs.writeFile('./view/profile.html', stringObject, function (err) {
            if (err) {
                console.error(err);
            }
            res.writeHead(301, {Location: '/info'});
            res.end();
        });
    });
}
handlers.info = (req, res) => {
    fs.readFile('./view/profile.html', 'utf-8', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
};

let router = {
    'home': handlers.home,
    'login': handlers.login,
    'profile': handlers.profile,
    'info': handlers.info
}
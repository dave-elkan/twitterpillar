var router = require("routes").Router(),
    HoganTemplateCompiler = require('hogan-template-compiler'),

    viewDirectory = __dirname + "/views",
    layoutDirectory = viewDirectory + "/layouts",
    partialsDirectory = viewDirectory + "/partials",

    hoganTemplateCompiler = HoganTemplateCompiler({
        layoutsDirectory: layoutDirectory,
        partialsDirectory: partialsDirectory
    });

var serverSideRenderer = require('./serverSideRenderer')(hoganTemplateCompiler, data),
    clientSideRenderer = require('./clientSideRenderer')(hoganTemplateCompiler, data);

router.addRoute("/server", serverSideRenderer);
router.addRoute("/client", clientSideRenderer);
router.addRoute("/static/*?", static);

router.addRoute("/templates.js", function(req, res) {
    var response = hoganTemplateCompiler.getSharedTemplates();

    res.writeHead(200, {
        'Content-Length': response.length,
        'Content-Type': "application/javascript"
    });
    res.end(response);
});

router.addRoute("/data", function(req, res) {
    var articles = JSON.stringify(data);
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(articles);
});

var http = require("http"),
    server = http.createServer(function(req, res) {

        if (process.env.NODE_ENV !== "production" && req.headers["accept"].indexOf("text/html") > -1) {
            hoganTemplateCompiler.read();
        }

        var route = router.match(req.url);
        if (!route) {
            res.writeHead(404, {
                'Content-Length': 3,
                'Content-Type': 'text/plain'
            });
            res.end("404");
        } else {
            route.fn(req, res);
        }
    });

server.listen(3000);
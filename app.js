var router = require("routes").Router(),
    HoganTemplateCompiler = require('hogan-template-compiler'),

    viewDirectory = __dirname + "/views",
    layoutDirectory = viewDirectory + "/layouts",
    partialsDirectory = viewDirectory + "/partials",

    twitterService = require('./twitterService'),
    followController = require("./twitterController"),

    hoganTemplateCompiler = HoganTemplateCompiler({
        layoutsDirectory: layoutDirectory,
        partialsDirectory: partialsDirectory
    });

    var static = require("./static"),
        fs = require("fs"),
        data = JSON.parse(fs.readFileSync(__dirname + "/input/hackernews.json", "utf8")),
        i = 0;

    data.items.forEach(function(d) {
        d.index = ++i;
    });

var serverSideRenderer = require('./serverSideRenderer')(hoganTemplateCompiler, twitterService),
    clientSideRenderer = require('./clientSideRenderer')(hoganTemplateCompiler, data),
    followerController = require("./twitterController");

router.addRoute("/server", serverSideRenderer);
router.addRoute("/client", clientSideRenderer);

router.addRoute("/tweeter/:screenName", followController);

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
            route.fn(req, res, route.params);
        }
    });

server.listen(3000);
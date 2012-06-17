var router = require("routes").Router(),
    HoganTemplateCompiler = require('hogan-template-compiler'),
    filed = require("filed"),

    viewDirectory = __dirname + "/views",
    layoutDirectory = viewDirectory + "/layouts",
    partialsDirectory = viewDirectory + "/partials",

    hoganTemplateCompiler = HoganTemplateCompiler({
        layoutsDirectory: layoutDirectory,
        partialsDirectory: partialsDirectory
    }),

    static = require("./lib/staticHandler"),
    homeController = require('./lib/controllers/HomeController')(hoganTemplateCompiler),
    followerController = require("./lib/controllers/FollowerController")(hoganTemplateCompiler);

router.addRoute("/static/*?", static);
router.addRoute("/", homeController);
router.addRoute("/templates.js", function(req, res) {
    var response = hoganTemplateCompiler.getSharedTemplates();

    res.writeHead(200, {
        'Content-Length': response.length,
        'Content-Type': "application/javascript"
    });
    res.end(response);
});

router.addRoute("/favicon.ico", function(req, res) {
    filed(__dirname + "/static/images/favicon.ico").pipe(res);
});

router.addRoute("/:tweeterScreenName", followerController);
router.addRoute("/:tweeterScreenName/follower/:followerScreenName", followerController);

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
console.log("twitterpillar running at http://localhost:3000/");
var router = require("routes").Router(),
    HoganTemplateCompiler = require('hogan-template-compiler'),

    viewDirectory = __dirname + "/views",
    layoutDirectory = viewDirectory + "/layouts",
    partialsDirectory = viewDirectory + "/partials",

    hoganTemplateCompiler = HoganTemplateCompiler({
        layoutsDirectory: layoutDirectory,
        partialsDirectory: partialsDirectory
    });

var serverSideRenderer = require('./serverSideRenderer')(hoganTemplateCompiler),
    clientSideRenderer = require('./clientSideRenderer')(hoganTemplateCompiler),
    static = require("./static");

router.addRoute("/server", serverSideRenderer);
router.addRoute("/client", clientSideRenderer);
router.addRoute("/static/*?", static)

router.addRoute("/templates.js", function(req, res) {
    var response = hoganTemplateCompiler.getSharedTemplates();

    res.writeHead(200, {
        'Content-Length': response.length,
        'Content-Type': "application/javascript"
    });
    res.end(response);
});

var http = require("http"),
    server = http.createServer(function(req, res) {
        var route = router.match(req.url);
        if (!route) {
            res.writeHead(404, {
                'Content-Length': 3,
                'Content-Type': 'text/plain'
            });
            res.end("404");
        } else {
            req.splats = route.splats;
            route.fn(req, res);
        }
    });

server.listen(3000)


/**
 * An Express compatible template compiler.

var hoganCompiler = {
    compile: function(source, options) {
        var template;
        if (options.filename.toLowerCase().indexOf("layout") > -1) {
            template = hoganTemplateCompiler.compileTemplateFile(options.filename);
        } else {
            template = hoganTemplateCompiler.getTemplate(options.filename);
        }

        return function(locals) {
            return template.render(locals, hoganTemplateCompiler.getPartials());
        };
    }
};
 */
/**
 * Request handler for pre-compiled hogan.js templates.
 *
 * This function uses a hogan template of it's own which renders
 * calls to Hogan.Template. See views/sharedTemplates.mustache.

app.get("/templates.js",  function(req, res) {
    res.contentType("templates.js");
    res.send(hoganTemplateCompiler.getSharedTemplates());
});
 */
/**
 * Request handler for the homepage.
 *
 * Renders a hogan template on the server side which contains a form
 * which will update the article section on the client using the
 * pre-compiled template.

app.get("/server", function(req, res) {
    res.render("layout", {
        headline: "This is a server-side rendered headline",
        bodyText: "This is some bodytext"
    });
});

app.get("/client", function(req, res) {
    res.render("dynamicLayout", {
        headline: "This is a server-side rendered headline",
        bodyText: "This is some bodytext"
    });
});

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);

 */
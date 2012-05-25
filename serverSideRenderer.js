function ServerSideRenderer(hoganTemplateCompiler) {

    return function (req, res) {

        var renderedTemplate = hoganTemplateCompiler.renderLayout("server", {
            headline: "This is a server-side rendered headline",
            bodyText: "This is a server-side rendered body"
        });

        res.writeHead(200, {
            'Content-Length': renderedTemplate.length,
            'Content-Type': 'text/html'
        });

        res.end(renderedTemplate);
    }
}

module.exports = ServerSideRenderer;
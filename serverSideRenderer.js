function ServerSideRenderer(hoganTemplateCompiler, data) {

    return function (req, res) {

        var renderedTemplate = hoganTemplateCompiler.renderLayout("server", data);

        res.writeHead(200, {
            'Content-Length': renderedTemplate.length,
            'Content-Type': 'text/html'
        });

        res.end(renderedTemplate);
    }
}

module.exports = ServerSideRenderer;
function ClientSideRenderer(hoganTemplateCompiler) {

    return function(req, res) {

        var renderedTemplate = hoganTemplateCompiler.renderLayout("client");

        res.writeHead(200, {
            'Content-Length': renderedTemplate.length,
            'Content-Type': 'text/html'
        });

        res.end(renderedTemplate);
    }
}

module.exports = ClientSideRenderer;
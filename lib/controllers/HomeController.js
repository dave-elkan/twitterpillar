function HomeController(hoganTemplateCompiler) {

    return function (req, res) {

        var renderedTemplate = hoganTemplateCompiler.renderLayout("home", {
            title: ""
        });

        res.writeHead(200, {
            'Max-Age': 0,
            'Content-Length': Buffer.byteLength(renderedTemplate),
            'Content-Type': 'text/html'
        });

        res.end(renderedTemplate);
    }
}

module.exports = HomeController;
function ClientSideRenderer(htc, data) {

    return function(req, res) {

        var renderedTemplate = htc.renderLayout("client", {
            newsItems: htc.getPartialSource("newsItems"),
            newsItem: htc.getPartialSource("newsItem"),
            table: htc.getPartialSource("table"),
            footer: htc.getPartialSource("footer"),
            data: JSON.stringify(data)
        });

        res.writeHead(200, {
            'Content-Length': renderedTemplate.length,
            'Content-Type': 'text/html'
        });

        res.end(renderedTemplate);
    }
}

module.exports = ClientSideRenderer;
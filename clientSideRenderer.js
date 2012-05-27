var fs = require("fs"),
    table = fs.readFileSync(__dirname + "/views/partials/table.mustache", "utf8"),
    footer = fs.readFileSync(__dirname + "/views/partials/footer.mustache", "utf8"),
    newsItems = fs.readFileSync(__dirname + "/views/partials/newsItems.mustache", "utf8"),
    newsItem = fs.readFileSync(__dirname + "/views/partials/newsItem.mustache", "utf8");

function ClientSideRenderer(hoganTemplateCompiler, data) {

    return function(req, res) {

        var renderedTemplate = hoganTemplateCompiler.renderLayout("client", {
            newsItems: newsItems,
            newsItem: newsItem,
            table: table,
            footer: footer,
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
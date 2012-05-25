var fs = require("fs"),
    articleTemplate = fs.readFileSync(__dirname + "/views/partials/article.mustache", "utf8"),
    updateArticleFormTemplate = fs.readFileSync(__dirname + "/views/partials/updateArticleForm.mustache", "utf8");

function ClientSideRenderer(hoganTemplateCompiler) {

    return function(req, res) {

        var renderedTemplate = hoganTemplateCompiler.renderLayout("client", {
            articleTemplate: articleTemplate,
            updateArticleFormTemplate: updateArticleFormTemplate
        });

        res.writeHead(200, {
            'Content-Length': renderedTemplate.length,
            'Content-Type': 'text/html'
        });

        res.end(renderedTemplate);
    }
}

module.exports = ClientSideRenderer;
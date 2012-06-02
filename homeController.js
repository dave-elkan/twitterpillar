var twitterService = require("./twitterService");

function HomeController(hoganTemplateCompiler) {

    return function (req, res) {

        twitterService.getFollowers("edave", function(err, followers) {

            var renderedTemplate = hoganTemplateCompiler.renderLayout("layout", {
                followers: followers,
                followersJSON: JSON.stringify(followers),
                tweeter: followers[0]
            });

            res.writeHead(200, {
                'Content-Length': renderedTemplate.length,
                'Content-Type': 'text/html'
            });

            res.end(renderedTemplate);
        });
    }
}

module.exports = HomeController;
var twitterService = require("./../services/twitterService");

function HomeController(hoganTemplateCompiler) {

    return function (req, res) {

        twitterService.getFollowersDetailsAndFirstFollowersTweets("edave", function(err, followers) {

            var renderedTemplate = hoganTemplateCompiler.renderLayout("layout", {
                followers: followers,
                followersJSON: JSON.stringify(followers),
                tweeter: followers[0]
            });

            res.writeHead(200, {
                'Max-Age': 0,
                'Content-Length': Buffer.byteLength(renderedTemplate),
                'Content-Type': 'text/html'
            });

            res.end(renderedTemplate);
        });
    }
}

module.exports = HomeController;
var twitterService = require('./twitterService');

function FollowerController(hoganTemplateCompiler) {
    return function(req, res, params) {
        var screenName = params["screenName"];
        twitterService.getUserDetails(screenName, function(error, tweeter) {
            if (req.headers['accept'].indexOf("application/json") > -1) {
                var tweeterString = JSON.stringify(tweeter);
                res.writeHeader(200, {
                    'Content-Type': 'application/json'
                });
                res.end(tweeterString);
            } else {
                res.writeHeader(200, {
                    'Content-Type': 'text/html'
                });
                res.end(hoganTemplateCompiler.renderPartial("tweeter", {
                    tweeter: tweeter
                }))
            }
        });
    };
}

module.exports = FollowerController;
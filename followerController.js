var twitterService = require('./twitterService');

function FollowerController(hoganTemplateCompiler) {
    return function(req, res, params) {

        var screenName = params["screenName"];

        twitterService.getFollowersAndAUsersDetails("edave", screenName, function(err, result) {
            var followers = result.followers,
                details = result.details;

            var response,
                contentType = "application/json";
            if (req.headers['accept'].indexOf("application/json") > -1) {
                response = JSON.stringify(details);
            } else {
                contentType = 'text/html';
                response = hoganTemplateCompiler.renderLayout("layout", {
                    followers: followers,
                    followersJSON: JSON.stringify(followers),
                    tweeter: details
                });
            }

            res.writeHeader(200, {
                'Content-Type': contentType,
                'Content-Length': Buffer.byteLength(response)
            });

            res.end(response);
        });
    };
}

module.exports = FollowerController;
var twitterService = require('./../services/twitterService');

function getTweeterByScreenName(followers, screenName) {
    for (var i = 0; i < followers.length; i++) {
        if (followers[i].screen_name === screenName) {
            return followers[i];
        }
    }
}

function FollowerController(hoganTemplateCompiler) {
    return function(req, res, params) {

        var screenName = params["screenName"];

        if (req.headers['accept'].indexOf("application/json") > -1) {
            twitterService.getUserDetailsWithTweets(screenName, function(err, follower) {
                var response = JSON.stringify(follower);
                res.writeHeader(200, {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(response)
                });

                res.end(response);
            });
        } else {
            twitterService.getFollowersDetailsWithTweets("edave", screenName, function(err, followers) {
                var response = hoganTemplateCompiler.renderLayout("layout", {
                    followers: followers,
                    followersJSON: JSON.stringify(followers),
                    tweeter: getTweeterByScreenName(followers, screenName)
                });

                res.writeHeader(200, {
                    'Content-Type': 'text/html',
                    'Content-Length': Buffer.byteLength(response)
                });

                res.end(response);

            });
        }
    }
}

module.exports = FollowerController;
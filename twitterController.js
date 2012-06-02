var twitterService = require('./twitterService');

module.exports = function(req, res, params) {
    var screenName = params["screenName"];
    twitterService.getUserDetails(screenName, function(error, user) {
        if (req.headers['accept'].indexOf("application/json") > -1) {
            var userString = JSON.stringify(user);
            res.writeHeader(200, {
                'Content-Type': 'application/json'
            });
            res.end(userString);
        } else {
            res.writeHeader(200, {
                'Content-Type': 'text/html'
            });
            res.end("<html><h1>Fix this</h1></html>")
        }
    });
};
var twitterAuth = require("./twitterAuth"),
    twitter = require('ntwitter'),
    fs = require("fs");

var twit = new twitter(twitterAuth);

var followerFile = fs.openSync(__dirname + "/input/followers.json", "a");

function getUserList(ids, callback) {
    twit.showUser(ids, function(err, resp) {
        if (err) {
            return callback(err);
        }

        fs.writeSync(followerFile, JSON.stringify(resp), 0);
        callback(null, resp);
    });
}

function getFollowerIds(userName, callback) {
    twit.getFollowersIds({
        screen_name: userName
    }, callback);
}

module.exports = {

    getFollowers: function(userName, callback) {
        var followersFileContents = fs.readFileSync(__dirname + "/input/followers.json", "utf8");
        if (followersFileContents.length) {
            callback(null, JSON.parse(followersFileContents));
        } else {
            getFollowerIds(userName, function(err, ids) {
                getUserList(ids.slice(0, 10), callback);
            });
        }
    },

    getUserDetails: function(screenName, callback) {
        var followersFileContents = fs.readFileSync(__dirname + "/input/followers.json", "utf8");
        if (followersFileContents.length) {
            var users = JSON.parse(followersFileContents);
            users.forEach(function(user) {
                if (user.screen_name === screenName) {
                    callback(null, user);
                }
            });
            callback("Cannot find user");
        } else {
            // blah
        }
    },

    getUsersTweets: function(userName, callback) {
        twit.getUserTimeline({
            screen_name: userName
        }, callback);
    }
}
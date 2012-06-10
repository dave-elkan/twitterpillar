var twitterAuth = require("./twitterAuth"),
    twitter = require('ntwitter'),
    async = require("async"),
    fs = require("fs");

var twit = new twitter(twitterAuth);

var followersFileContents = fs.readFileSync(__dirname + "/../../input/followers.json", "utf8");
var tweetsFileContents = fs.readFileSync(__dirname + "/../../input/tweets.json", "utf8");

var staticFollowers = JSON.parse(followersFileContents),
    staticTweets = JSON.parse(tweetsFileContents),
    offline = false;

function getUserList(ids, callback) {
    twit.showUser(ids, function(err, resp) {
        if (err) {
            return callback(err);
        }

        callback(null, resp);
    });
}

function getFollowerIds(screenName, callback) {
    twit.getFollowersIds(screenName, function(err, res) {
        callback(err, res);
    });
}

function getUsersTweets(params, callback) {
    if (offline && staticTweets.length) {
        callback(null, staticTweets);
    } else {
        twit.getUserTimeline(params, callback);
    }
}

function lookupUser(userId, callback) {
    if (offline && staticFollowers.length) {
        var follower = staticFollowers[0];
        for (var i = 0; i < staticFollowers.length; i++) {
            if (staticFollowers[i].id == userId) {
                follower = staticFollowers[i];
            }
        }
        callback(null, [follower]);
    } else {
        twit.get('/users/lookup.json', {
            user_id: userId
        }, callback);
    }
}

function getFollowers(userName, callback) {
    if (offline && staticFollowers.length) {
        callback(null, staticFollowers);
    } else {
        getFollowerIds(userName, function(err, ids) {
            getUserList(ids.slice(0, 10), callback);
        });
    }
}

function updateFollowerImages(followers) {
    followers.forEach(function(follower) {
        updateFollowerImage(follower);
    });

    return followers;
}

function updateFollowerImage(follower) {
    if (follower && follower.profile_image_url) {
        follower.profile_image_url = follower.profile_image_url.replace("_normal", "_reasonably_small");
    }
}

module.exports = {

   getFollowersDetailsAndFirstFollowersTweets: function(followeeScreenName, callback) {
        getFollowers(followeeScreenName, function(error, followers) {
            if (followers.length) {
                updateFollowerImages(followers);
                getUsersTweets({
                    id: followers[0].id
                }, function(error, tweets) {
                    followers[0].tweets = tweets;
                    callback(null, followers);
                });
            }
        })
    },

    getUserDetailsWithTweets: function(userId, callback) {
        var requests = {
                follower: function(done) {
                    lookupUser(userId, function(error, user) {
                        updateFollowerImages(user);
                        done(null, user);
                    });
                },
                tweets: function(done) {
                    getUsersTweets({
                        id: userId
                    }, done);
                }
            };

        async.parallel(requests, function(err, result) {
            if (result.tweets && result.follower && result.follower.length) {
                result.follower[0].tweets = result.tweets;
                callback(null, result.follower[0]);
            } else {
                callback(null, {});
            }
        });
    },

    getFollowersDetailsWithTweets: function(followeeScreenName, tweetsScreenName, callback) {

        var requests = {
                followers: function(done) {
                    getFollowers(followeeScreenName, function(err, followers) {
                        updateFollowerImages(followers);
                        done(null, followers);
                    });
                },
                tweets: function(done) {
                    getUsersTweets({
                        screen_name: tweetsScreenName
                    }, done);
                }
            };

        async.parallel(requests, function(err, result) {
            var followers = result.followers;
            followers.forEach(function(follower) {
                if (follower.screen_name === tweetsScreenName) {
                    follower.tweets = result.tweets;
                }
            });

            callback(null, followers);
        });
    }
}
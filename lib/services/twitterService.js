var twitter = require('ntwitter'),
    async = require("async"),
    fs = require("fs"),
    _ = require("underscore");

var twit = new twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

var followersFileContents = fs.readFileSync(__dirname + "/../../input/followers.json", "utf8");
var tweetsFileContents = fs.readFileSync(__dirname + "/../../input/tweets.json", "utf8");

var staticFollowers = JSON.parse(followersFileContents),
    staticTweets = JSON.parse(tweetsFileContents),
    offline = false;

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

function getOrderedFollowers(userName, callback) {
    getFollowers(userName, function(err, users) {
        if (err) {
            callback(err);
            return;
        }
        var sortedUsers = _.sortBy(users, function(user) {
            return user.name;
        });

        callback(null, sortedUsers);
    });
}

function getFollowers(userName, callback) {
    if (offline && staticFollowers.length) {
        callback(null, staticFollowers);
    } else {
        twit.getFollowersIds(userName, function(err, ids) {
            twit.showUser(ids.slice(0, 20), callback);
        });
    }
}

function updateFollowerImages(followers) {
    followers.forEach(function(follower) {
        if (follower && follower.profile_image_url) {
            follower.profile_image_url = follower.profile_image_url.replace("_normal", "_reasonably_small");
        }
    });

    return followers;
}

function getFollowersDetailsAndFirstFollowersTweets(followeeScreenName, callback) {
    getOrderedFollowers(followeeScreenName, function(error, followers) {
        if (followers.length) {
            updateFollowerImages(followers);
            getUsersTweets({
                id: followers[0].id
            }, function(error, tweets) {
                followers[0].tweets = tweets;
                callback(null, followers);
            });
        } else {
            callback(null, []);
        }
    })
}

module.exports = {

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

        if (!tweetsScreenName) {
            getFollowersDetailsAndFirstFollowersTweets(followeeScreenName, callback);
        } else {
            var requests = {
                followers: function(done) {
                    getOrderedFollowers(followeeScreenName, function(err, followers) {
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
                if (followers) {
                    followers.forEach(function(follower) {
                        if (follower.screen_name === tweetsScreenName) {
                            follower.tweets = result.tweets;
                        }
                    });
                    callback(null, followers);
                } else {
                    callback(null, []);
                }

            });
        }
    }
}
var twitter = require('ntwitter'),
    async = require("async"),
    _ = require("underscore");

var twit = new twitter();

function lookupUser(userId, callback) {
    twit.get('/users/lookup.json', {
        user_id: userId
    }, callback);
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
    twit.getFollowersIds(userName, function(err, ids) {
        twit.showUser(ids.slice(0, 20), callback);
    });
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
            twit.getUserTimeline({
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
                    twit.getUserTimeline({
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
                    twit.getUserTimeline({
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
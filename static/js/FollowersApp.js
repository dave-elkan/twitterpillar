$(function() {
    var tweeterCollection = new TweeterCollection(followers);
    var followersAppModel = new FollowersAppModel({
        collection: tweeterCollection
    });

    new TweeterNavView({
        model: followersAppModel,
        el: $("#followers")
    });

    new TitleView({
        model: followersAppModel,
        el: $("title")
    });

    if (window.history && history.pushState) {
        Backbone.history.start({
            pushState: true
        });
    }
});

// /          -> Form
// /screenName -> List of followers -> 1st tweets
// /screenName/follower/followerScreenName -> List of followers -> Selected users details and tweets
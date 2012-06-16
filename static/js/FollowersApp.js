$(function() {
    var tweeterCollection = new TweeterCollection(followers);
    var followersAppModel = new FollowersAppModel({
        collection: tweeterCollection,
        usePushState: !!((window.history && history.pushState))
    });

    new TweeterNavView({
        model: followersAppModel,
        el: $("#followers")
    });

    new TitleView({
        model: followersAppModel,
        el: $("title")
    });
});
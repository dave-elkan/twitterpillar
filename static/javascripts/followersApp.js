$(function() {
    var tweeterCollection = new TweeterCollection(followers);
    var tweeterRouter = new TweeterRouter();

    var tweeterApp = new TweeterAppModel({
        collection: tweeterCollection
    });

    var tweeterNavView = new TweeterNavView({
        collection: tweeterCollection,
        model: tweeterApp,
        el: $("#followers")
    });

    var tweeterView = new TweeterView({
        model: tweeterApp,
        el: $("#tweeter")
    });

    tweeterRouter.on("route:tweeter", tweeterApp.setSelectedTweeter);
    tweeterRouter.on("route:home", tweeterApp.resetSelectedTweeter);

    if (window.history && history.pushState) {
        Backbone.history.start({
            pushState: true
        });
    }
});
$(function() {
    var tweeterCollection = new TweeterCollection(followers);
    var tweeterRouter = new TweeterRouter();

    new TweeterNavView({
        collection: tweeterCollection,
        el: $("#followers")
    });

    var tweeterView = new TweeterView({
        model: tweeterCollection,
        el: $("#tweeter")
    });

    new TitleView({
        model: tweeterCollection,
        el: $("title")
    });

    tweeterRouter.on("route:tweeter", tweeterCollection.setSelected);
    tweeterRouter.on("route:home", tweeterCollection.resetSelected);
    tweeterCollection.on("change", tweeterView.update);

    if (window.history && history.pushState) {
        Backbone.history.start({
            pushState: true
        });
    }
});
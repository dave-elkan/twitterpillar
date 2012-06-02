TweeterRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        ":screenName": "tweeter"
    }

});
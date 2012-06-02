TweeterRouter = Backbone.Router.extend({

    routes: {
        "server": "home",
        "tweeter/:screenName": "tweeter"
    }

})
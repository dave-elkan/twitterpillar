TweeterCollection = Backbone.Collection.extend({

    url: "/",
    model: TweeterModel,

    initialize: function() {
        _.bindAll(this);
    },

    getByScreenName: function(screenName) {
        var tweeters = this.filter(function(model) {
            return model.get("screen_name") === screenName;
        });
        if (tweeters.length > 0) {
            return tweeters[0];
        }
    }
});
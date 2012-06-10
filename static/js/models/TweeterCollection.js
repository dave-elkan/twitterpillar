TweeterCollection = Backbone.Collection.extend({

    url: "/",
    model: TweeterModel,

    initialize: function() {
        _.bindAll(this);
    },

    setSelected: function(screenName) {
        this.each(function(tweeter) {
            if (tweeter.get("screen_name") === screenName) {
                tweeter.set("selected", true);
                if (!tweeter.get("tweets")) {
                    tweeter.fetch();
                }
            } else {
                tweeter.set("selected", false, {
                    silent: true
                })
            }
        })
    },

    resetSelected: function() {
        this.setSelected(this.first().get("screen_name"));
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
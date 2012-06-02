var TweeterAppModel = Backbone.Model.extend({

    initialize: function(options) {
        _.bindAll(this);
    },

    setSelectedTweeter: function(screenName) {
        var tweeters = this.get("collection").getByScreenName(screenName);
        if (tweeters.length) {
            this.set("selected", tweeters[0]);
        }
    },

    resetSelectedTweeter: function() {
        var first = this.get("collection").first();
        if (first) {
            this.set("selected", first);
        }
    }
});
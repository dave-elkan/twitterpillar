TweeterCollection = Backbone.Collection.extend({

    url: "/tweeter/",
    model: TweeterModel,

    initialize: function() {
        _.bindAll(this);
    },

    getByScreenName: function(screenName) {
        return this.filter(function(model) {
            return model.get("screen_name") === screenName;
        });
    }
});
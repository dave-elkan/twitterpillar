TweeterModel = Backbone.Model.extend({

    initialize: function(model) {
        if (model.tweets) {
            model.tweets = new TweetCollection(model.tweets);
        }
    }

});
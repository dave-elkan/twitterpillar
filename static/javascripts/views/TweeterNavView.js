TweeterNavView = Backbone.View.extend({

    events: {
        "click a": "displayTweeter"
    },

    initialize: function() {
        _.bindAll(this);
    },

    displayTweeter: function(e) {
        e.preventDefault();
        var target = $(e.target);
        Backbone.history.navigate("tweeter/" + target.data("screen_name"), true);
    }

});
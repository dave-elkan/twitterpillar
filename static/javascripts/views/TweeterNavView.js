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
        Backbone.history.navigate(target.data("screen_name"), true);
    }

});
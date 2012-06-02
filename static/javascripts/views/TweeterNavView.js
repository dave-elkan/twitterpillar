TweeterNavView = Backbone.View.extend({

    events: {
        "click a": "displayTweeter"
    },

    initialize: function() {
        _.bindAll(this);
    },

    displayTweeter: function(e) {
        e.preventDefault();
        Backbone.history.navigate($(e.target).data("screen_name"), true);
    }

});
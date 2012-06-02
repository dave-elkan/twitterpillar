TweeterNavView = Backbone.View.extend({

    events: {
        "click a": "displayTweeter"
    },

    initialize: function() {
        _.bindAll(this);
    },

    displayTweeter: function(e) {
        if (window.history && history.pushState) {
            e.preventDefault();
            Backbone.history.navigate($(e.target).data("screen_name"), true);
        }
    }

});
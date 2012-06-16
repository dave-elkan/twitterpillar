TweeterNavView = Backbone.View.extend({

    events: {
        "click a": "displayTweeter"
    },

    initialize: function() {
        _.bindAll(this);
    },

    displayTweeter: function(e) {
        if (this.model.get("usePushState")) {
            this.model.set("follower", $(e.target).data("screen_name"));
            e.preventDefault();
        }
    }

});
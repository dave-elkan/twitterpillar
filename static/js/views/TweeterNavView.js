TweeterNavView = Backbone.View.extend({

    events: {
        "click a": "displayTweeter"
    },

    initialize: function() {
        _.bindAll(this);
    },

    displayTweeter: function(e) {
        this.model.browseToFollower(e);
    }

});
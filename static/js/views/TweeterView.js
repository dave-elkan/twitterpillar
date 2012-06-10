TweeterView = Backbone.View.extend({

    template: templates.tweeter,

    initialize: function() {
        _.bindAll(this);
        this.model.on("change:tweets", this.render);
    },

    render: function() {
        var $el = $(this.template(this.model.toJSON()));
        this.$el.after($el);
        this.$el.remove();
        this.$el = $el;
        return this.$el;
    },

    update: function(model) {
        if (this.$el.data("screen_name") !== model.get("screen_name")) {
            this.model = model;
            this.render();
        }
    }

});
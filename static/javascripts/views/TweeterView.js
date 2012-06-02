TweeterView = Backbone.View.extend({

    template: templates.tweeter,

    initialize: function() {
        this.model.on("change:selected", this.update.bind(this));
        _.bindAll(this);
    },

    render: function() {
        var $el = this.template(this.model.toJSON());
        this.$el.after($el);
        this.$el.remove();
        this.$el = $el;
        return this.$el;
    },

    update: function(app, model) {
        if (this.$el.data("screen_name") !== model.get("screen_name")) {
            this.model = model;
            this.render();
        }
    }

});
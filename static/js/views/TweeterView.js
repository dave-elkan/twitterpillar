TweeterView = Backbone.View.extend({

    template: templates.selectedFollower,

    initialize: function() {
        _.bindAll(this);
        this.model.on("change", this.render);
    },

    render: function() {
        var $el = $(this.template(this.model.toJSON()));
        this.$el.after($el);
        this.$el.remove();
        this.$el = $el;
        return this.$el;
    }

});
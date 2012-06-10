TitleView = Backbone.View.extend({

    template: templates.tweeter,

    initialize: function() {
        _.bindAll(this);
        this.model.on("change", this.render);
    },

    render: function(model) {
        this.$el.html(templates.title({
            tweeter: model.toJSON()
        }));
    }
});
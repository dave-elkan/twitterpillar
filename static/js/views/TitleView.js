TitleView = Backbone.View.extend({

    template: templates.tweeter,

    initialize: function() {
        _.bindAll(this);
        this.model.on("change:follower", this.render);
    },

    render: function() {
        var selectedFollower = this.model.getSelectedFollower();
        this.$el.html(templates.title({
            selectedFollower: selectedFollower.toJSON()
        }));
    }
});
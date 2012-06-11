FollowersAppModel = Backbone.Model.extend({

    initialize: function(options) {
        _.bindAll(this);
        this.collection = options.collection;
        this.router = new TweeterRouter();

        this.router.on("route:followee", this.setFollowee);
        this.router.on("route:followeeWithFollower", this.setFolloweeAndFollower);
        this.router.on("route:followee", _.bind(function() {
            this.setFollower(this.collection.at(0).get("screen_name"));
        }, this));
//        tweeterRouter.on("route:home", this.collection.resetSelected);
    },

    setFollowee: function(followeeScreenName) {
        this.set("followee", followeeScreenName);
    },

    setFollower: function(followerScreenName) {
        this.set("follower", followerScreenName);
        this.router.navigate(this.get("followee") + "/follower/" + followerScreenName, true);
        var follower = this.getFollower();
        new TweeterView({
            model: follower,
            el: $("#tweeter")
        }).render();
    },

    getFollower: function() {
        var follower = this.collection.getByScreenName(this.get("follower"));
        if (!follower.get("tweets")) {
            follower.fetch();
        }
        return follower;
    },

    /**
     * Only browse to a follower if the browser supports the History API.
     * Else, simply follow the hard link.
     *
     * @param e The click event.
     */
    browseToFollower: function(e) {
        if (window.history && history.pushState) {
            e.preventDefault();
            this.setFollower($(e.target).data("screen_name"));
        }
    },

    setFolloweeAndFollower: function(followeeScreenName, followerScreenName) {
        // Set followee on initial page load
        if (!this.get("followee")) {
            this.setFollowee(followeeScreenName);
        }

        // Set follower on initial page load or when it changes
        var follower = this.get("follower");
        if (!follower || follower !== followerScreenName) {
            this.setFollower(followerScreenName);
        }
    }

});

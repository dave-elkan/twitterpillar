FollowersAppModel = Backbone.Model.extend({

    initialize: function(options) {
        _.bindAll(this);
        this.collection = options.collection;
        this.router = new TweeterRouter();

        this.router.on("route:followee", this.setCurrentFollowee);
        this.router.on("route:follower", this.browsingToFollower);

        this.on("change:follower", this.setSelectedFollower);

        this.set("usePushState", options.usePushState || false)

        if (options.usePushState) {
            Backbone.history.start({
                pushState: true
            });
        }
    },

    /**
     * Called when the router detects that we're browsing to a followee/follower combination.
     *
     * @param followeeScreenName
     * @param followerScreenName
     */
    browsingToFollower: function(followeeScreenName, followerScreenName) {
        this.setCurrentFollowee(followeeScreenName);
        this.set("follower", followerScreenName);
    },

    /**
     * Sets the followee's screen name from the URL
     *
     * @param followeeScreenName
     */
    setCurrentFollowee: function(followeeScreenName) {
        if (!this.get("followee")) {
            this.set("followee", followeeScreenName);
        }
    },

    /**
     * Sets the follower and routes to a URL representing that follower.
     *
     * @param followerScreenName The follower's screen name
     */
    setSelectedFollower: function(app, followerScreenName) {
        this.router.navigate(this.get("followee") + "/follower/" + followerScreenName, true);
        new TweeterView({
            model: this.getSelectedFollower(),
            el: $("#tweeter")
        }).render();
    },

    /**
     * Returns the model of the currently selected follower from the Follower Collection.
     *
     * @return {Object} The follower
     */
    getSelectedFollower: function() {
        var follower = this.collection.getByScreenName(this.get("follower"));
        if (!follower.get("tweets")) {
            follower.fetch();
        }

        return follower;
    }
});

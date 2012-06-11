TweeterRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        ":followeeScreenName": "followee",
        ":followeeScreenName/follower/:followerScreenName": "followeeWithFollower"
    }

});
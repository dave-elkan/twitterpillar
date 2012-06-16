TweeterRouter = Backbone.Router.extend({

    routes: {
        ":followeeScreenName": "followee",
        ":followeeScreenName/follower/:followerScreenName": "follower"
    }

});
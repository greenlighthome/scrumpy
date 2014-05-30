/**
 * Created by Matthias on 09/04/14.
 */

var notificationIdsArray, l;

Template.notifications.helpers({
    notifications: function() {
        if (Meteor.user().notifications === undefined) {
            return null;
        }
        return Notifications.find({_id: { $in: notificationIdsArray }}, {sort: {submitted: -1}});
    },
    notificationCount: function() {
        if (Meteor.user().notifications === undefined || Meteor.user().notifications.length == 0) {
            return 0;
        }
        notificationIdsArray=[],l=Meteor.user().notifications.length;
        while(l--){notificationIdsArray[l]=Meteor.user().notifications[l]._id};
        if (Meteor.user().notifications.length > 0) {
            return Notifications.find({_id: { $in: notificationIdsArray }}).count();
        }
    }
});

Template.notification.helpers({
    notificationPath: function(pathToSource) {
        return Router.routes[pathToSource].path({_id: this.projectId});
    },
    notificationType : function(type) {
        return this.type == type;
    },
    stickyLocation: function() {
        if (this.stickyNewLocation == "ToDo") {
            return "ToDo";
        } else if (this.stickyNewLocation == "Started") {
            return "Started";
        } else if (this.stickyNewLocation == "Verify") {
            return "Verify";
        } else if (this.stickyNewLocation == "Done") {
            return "Done";
        } else {
            return "Unknown";
        }
    }
});

Template.notifications.events({
    'click .markNotificationsAsRead a': function() {
        var userNotifications = Meteor.user().notifications;
        Meteor.call('markAllNotificationsAsRead', Meteor.userId(), function(err) {
            if (!err) {
                for (var i = 0; i < userNotifications.length; i++) {
                    if (Users.find({notifications: {_id: userNotifications[i]._id}}).count() == 0) {
                        Notifications.remove({_id: userNotifications[i]._id}); // no users with this notification -> delete main notification
                    }
                }
            } else {
                Toast.error(err);
            }
        });
    }
});

Template.notification.events({
    'click a': function() {
        var self = this;
        Meteor.call('markSingleNotificationAsRead', Meteor.userId(), this._id, function(err) {
            if (!err) {
                var usersExistsWithThisNotification = Users.find({notifications: {_id: self._id}}).count();
                if (usersExistsWithThisNotification == 0) { // no users with this notification -> delete main notification
                    Notifications.remove({_id: self._id});
                }
            } else {
                Toast.error(err);
            }
        });
    }
});



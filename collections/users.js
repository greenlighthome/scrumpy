/**
 * Created by Matthias on 03/03/14.
 */

Users = Meteor.users;

Users.deny({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

var serverVar = false;
if(Meteor.isServer) {
    serverVar = true;
}

Meteor.methods({
    updateUserNotificationStatus: function(userId, obj) {
        if(serverVar) {
            Users.update({_id: userId}, {$set: obj});
        }
    },
    markAllNotificationsAsRead: function(userId) {
        if(serverVar) {
            Users.update({_id: userId}, {$set: {notifications: []}}); // removing all references
        }
    },
    markSingleNotificationAsRead: function(userId, notificationId) {
        if(serverVar) {
            Users.update({_id: userId}, {$pull: {notifications: {_id: notificationId}}}); // removing reference
        }
    }
});
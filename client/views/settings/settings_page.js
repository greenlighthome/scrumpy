/**
 * Created by Matthias on 16/04/14.
 */

Template.settingsPage.helpers({
    checkedNotification: function(type) {return settingsNotificationsChecked(type)}
});

Template.settingsPage.events({

    'click #notificationStickyCreated': function() {handleUpdateNotificationStatusFunction('stickyCreated');},
    'click #notificationStickyEdited': function() {handleUpdateNotificationStatusFunction('stickyEdited');},
    'click #notificationStickyMoved': function() {handleUpdateNotificationStatusFunction('stickyMoved');},
    'click #notificationStickyDeleted': function() {handleUpdateNotificationStatusFunction('stickyDeleted');},
    'click #notificationStoryCreated': function() {handleUpdateNotificationStatusFunction('storyCreated');},
    'click #notificationStoryEdited': function() {handleUpdateNotificationStatusFunction('storyEdited');},
    'click #notificationStoryDeleted': function() {handleUpdateNotificationStatusFunction('storyDeleted');},
    'click #notificationUsersAddedToProject': function() {handleUpdateNotificationStatusFunction('usersAddedToProject');},
    'click #notificationUsersRemovedFromProject': function() {handleUpdateNotificationStatusFunction('usersRemovedFromProject');},
    'click #notificationCommentAdded': function() {handleUpdateNotificationStatusFunction('commentAdded');}
});

function handleUpdateNotificationStatusFunction(name) {
    if (Meteor.user().settingsNotifications[name]) {
        updateNotificationStatus(false, name);
    } else {
        updateNotificationStatus(true, name);
    }
}

function updateNotificationStatus(notificationStatus, name) {
    var obj = {};
    var field = "settingsNotifications." + name;
    obj[field] = notificationStatus;

    Meteor.call('updateUserNotificationStatus', Meteor.userId(), obj, function(err) {
        if (err) {
            Toast.error(err);
        }
    });
    Toast.success("Notification updated.")
}

function settingsNotificationsChecked(item) {
    if (Meteor.user()) {
        if (Meteor.user().settingsNotifications[item]) {
            return "checked";
        }
    }
    return "";
}
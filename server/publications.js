/**
 * Created by Matthias on 01/03/14.
 */

Meteor.publish('projects', function(options, projectIds) {
    if (!projectIds) {
        return null;
    }
    return Projects.find({_id: {$in:projectIds}}, options);
});

Meteor.publish('singleProject', function(id) {
    return id && Projects.find(id);
});

Meteor.publish('userStories', function(id) {
    return id && UserStories.find({projectId: id});
});

Meteor.publish('usernamesRoles', function() {
    return Users.find({}, {
        fields: { 'username': 1, 'roles': 1 }
    });
});

Meteor.publish('ownUser', function(id) {
    return Users.find({_id: id});
});

Meteor.publish('comments', function(id) {
    return id &&  Comments.find({projectId: id});
});

Meteor.publish('stickies', function(id) {
    return id && Stickies.find({projectId: id});
});

Meteor.publish('notifications', function(id) {
    return Notifications.find({_id: {$in:id}});
});

Meteor.publish(null, function() {
    return Users.find({_id: this.userId}, {fields: {notifications: 1, 'settingsNotifications': 1}});
});

Meteor.publish('burndown', function(id) {
    return id && Burndown.find({projectId: id});
});
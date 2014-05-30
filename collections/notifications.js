/**
 * Created by Matthias on 09/04/14.
 */

Notifications = new Meteor.Collection('notifications');

Notifications.allow({
    insert: ownsDocument,
    update: function() {
        return false;
    },
    remove: function() {
        return true;
    }
});

function setNotificationVars(project) {
    return [Roles.userIsInRole(Meteor.user(), project._id + '-admin'),
        Roles.userIsInRole(Meteor.user(), project._id + '-member'),
        Roles.getUsersInRole(project._id + '-admin').count(),
        Roles.getUsersInRole(project._id + '-member').count(), 0];
}

function checkMemberAdminCountRoles(isUserInRoleAdmin, isUserInRoleMember, memberCountRoleAdmin, memberCountRoleMember) {
    if (isUserInRoleAdmin == true) {
        memberCountRoleAdmin--;
    }
    if (isUserInRoleMember == true) {
        memberCountRoleMember--;
    }
    return [memberCountRoleAdmin, memberCountRoleMember];
}

function checkIsUserInRoleAdminMember(userId, projectId) {
    return (Roles.userIsInRole(userId, projectId + '-admin') ||
        Roles.userIsInRole(userId, projectId + '-member'));
}

function checkMemberCount(memberCountRoleAdmin, memberCountRoleMember) {
    return (memberCountRoleAdmin > 0 || memberCountRoleMember > 0);
}

function addUserNotifications(projectId, userId, notificationType, notificationCounter, notification_id) {
    Roles.getUsersInRole(projectId + '-admin').forEach(function (user) {
        if (userId !== user._id) { // do not display the notification to the user who created the document
            if (user.settingsNotifications[notificationType] == true) {
                Users.update({_id: user._id},{$push:{notifications: { _id: notification_id}}});
                notificationCounter++;
            }
        }
    });

    Roles.getUsersInRole(projectId + '-member').forEach(function (user) {
        if (userId !== user._id) { // do not display the notification to the user who created the document
            if (user.settingsNotifications[notificationType] == true) {
                Users.update({_id: user._id},{$push:{notifications: { _id: notification_id}}});
                notificationCounter++;
            }
        }
    });
    return notificationCounter;
}

function checkIfNotificationCounterIsZero(notificationCounter, notification_id) {
    if (notificationCounter == 0) {
        Notifications.remove({_id: notification_id});
    }
}

var serverVar = false;
if(Meteor.isServer) {
    serverVar = true;
}

Meteor.methods({
    createCommentNotification: function(comment) {
        if(serverVar) {
            var project = Projects.findOne(comment.projectId);
            var notificationVars = setNotificationVars(project);
            var isUserInRoleAdmin = notificationVars[0];
            var isUserInRoleMember = notificationVars[1];
            var memberCountRoleAdmin = notificationVars[2];
            var memberCountRoleMember = notificationVars[3];
            var notificationCounter = notificationVars[4];

            var checkMemberAdminCountRolesVars = checkMemberAdminCountRoles(isUserInRoleAdmin, isUserInRoleMember, memberCountRoleAdmin, memberCountRoleMember);
            memberCountRoleAdmin = checkMemberAdminCountRolesVars[0];
            memberCountRoleMember = checkMemberAdminCountRolesVars[1];

            if (checkIsUserInRoleAdminMember(comment.userId, comment.projectId)) {
                if (checkMemberCount(memberCountRoleAdmin, memberCountRoleMember)) {
                    var notification_id = Notifications.insert({
                        userId: comment.userId,
                        projectId: project._id,
                        objectId: comment._id,
                        author: comment.author,
                        projectTitle: project.title,
                        type: "comment",
                        submitted: new Date().getTime()
                    });
                }

                notificationCounter = addUserNotifications(comment.projectId, comment.userId, 'commentAdded', notificationCounter, notification_id);

                checkIfNotificationCounterIsZero(notificationCounter, notification_id);
            }
        }
    },
    createStickyNotification : function(stickyId) {
        if(serverVar) {
            var sticky = Stickies.findOne(stickyId);
            var project = Projects.findOne(sticky.projectId);
            var notificationVars = setNotificationVars(project);
            var isUserInRoleAdmin = notificationVars[0];
            var isUserInRoleMember = notificationVars[1];
            var memberCountRoleAdmin = notificationVars[2];
            var memberCountRoleMember = notificationVars[3];
            var notificationCounter = notificationVars[4];

            var checkMemberAdminCountRolesVars = checkMemberAdminCountRoles(isUserInRoleAdmin, isUserInRoleMember, memberCountRoleAdmin, memberCountRoleMember);
            memberCountRoleAdmin = checkMemberAdminCountRolesVars[0];
            memberCountRoleMember = checkMemberAdminCountRolesVars[1];

            if (checkIsUserInRoleAdminMember(sticky.userId, sticky.projectId)) {
                if (checkMemberCount(memberCountRoleAdmin, memberCountRoleMember)) {
                    var notification_id = Notifications.insert({
                        userId: sticky.userId,
                        projectId: project._id,
                        objectId: sticky._id,
                        author: sticky.author,
                        projectTitle: project.title,
                        stickyTitle: sticky.title,
                        type: "stickyCreated",
                        submitted: new Date().getTime()
                    });
                }

                notificationCounter = addUserNotifications(sticky.projectId, sticky.userId, 'stickyCreated', notificationCounter, notification_id);

                checkIfNotificationCounterIsZero(notificationCounter, notification_id);
            }
        }
    },
    moveStickyNotification : function(stickyId) {
        if(serverVar) {
            var sticky = Stickies.findOne(stickyId);
            var project = Projects.findOne(sticky.projectId);
            var story = UserStories.findOne(sticky.storyId);
            var notificationVars = setNotificationVars(project);
            var isUserInRoleAdmin = notificationVars[0];
            var isUserInRoleMember = notificationVars[1];
            var memberCountRoleAdmin = notificationVars[2];
            var memberCountRoleMember = notificationVars[3];
            var notificationCounter = notificationVars[4];

            var checkMemberAdminCountRolesVars = checkMemberAdminCountRoles(isUserInRoleAdmin, isUserInRoleMember, memberCountRoleAdmin, memberCountRoleMember);
            memberCountRoleAdmin = checkMemberAdminCountRolesVars[0];
            memberCountRoleMember = checkMemberAdminCountRolesVars[1];

            if (checkIsUserInRoleAdminMember(sticky.userId, sticky.projectId)) {
                if (checkMemberCount(memberCountRoleAdmin, memberCountRoleMember)) {
                    var notification_id = Notifications.insert({
                        userId: sticky.userId,
                        projectId: project._id,
                        objectId: sticky._id,
                        author: sticky.author,
                        projectTitle: project.title,
                        stickyTitle: sticky.title,
                        stickyNewLocation: sticky.status,
                        storyTitle: story.title,
                        lastMoved: sticky.lastMoved,
                        type: "stickyMoved",
                        submitted: new Date().getTime()
                    });
                }

                var userLastMoved = Users.findOne({username: sticky.lastMoved});
                notificationCounter = addUserNotifications(sticky.projectId, userLastMoved._id, 'stickyMoved', notificationCounter, notification_id);

                checkIfNotificationCounterIsZero(notificationCounter, notification_id);
            }
        }
    },
    editStickyNotification : function(stickyId, stickyOldTitle) {
        if(serverVar) {
            var sticky = Stickies.findOne(stickyId);
            var project = Projects.findOne(sticky.projectId);
            var notificationVars = setNotificationVars(project);
            var isUserInRoleAdmin = notificationVars[0];
            var isUserInRoleMember = notificationVars[1];
            var memberCountRoleAdmin = notificationVars[2];
            var memberCountRoleMember = notificationVars[3];
            var notificationCounter = notificationVars[4];

            var checkMemberAdminCountRolesVars = checkMemberAdminCountRoles(isUserInRoleAdmin, isUserInRoleMember, memberCountRoleAdmin, memberCountRoleMember);
            memberCountRoleAdmin = checkMemberAdminCountRolesVars[0];
            memberCountRoleMember = checkMemberAdminCountRolesVars[1];

            if (checkIsUserInRoleAdminMember(sticky.userId, sticky.projectId)) {
                if (checkMemberCount(memberCountRoleAdmin, memberCountRoleMember)) {
                    var notification_id = Notifications.insert({
                        userId: sticky.userId,
                        projectId: project._id,
                        objectId: sticky._id,
                        author: sticky.author,
                        projectTitle: project.title,
                        stickyTitle: sticky.title,
                        stickyOldTitle: stickyOldTitle,
                        lastEdited: sticky.lastEdited,
                        type: "stickyEdited",
                        submitted: new Date().getTime()
                    });
                }

                var userLastEdited = Users.findOne({username: sticky.lastEdited});
                notificationCounter = addUserNotifications(sticky.projectId, userLastEdited._id, 'stickyEdited', notificationCounter, notification_id);

                checkIfNotificationCounterIsZero(notificationCounter, notification_id);
            }
        }
    },
    deleteStickyNotification : function(stickyId, userDeletedSticky) {
        if(serverVar) {
            var sticky = Stickies.findOne(stickyId);
            var project = Projects.findOne(sticky.projectId);
            var story = UserStories.findOne(sticky.storyId);
            var notificationVars = setNotificationVars(project);
            var isUserInRoleAdmin = notificationVars[0];
            var isUserInRoleMember = notificationVars[1];
            var memberCountRoleAdmin = notificationVars[2];
            var memberCountRoleMember = notificationVars[3];
            var notificationCounter = notificationVars[4];

            var checkMemberAdminCountRolesVars = checkMemberAdminCountRoles(isUserInRoleAdmin, isUserInRoleMember, memberCountRoleAdmin, memberCountRoleMember);
            memberCountRoleAdmin = checkMemberAdminCountRolesVars[0];
            memberCountRoleMember = checkMemberAdminCountRolesVars[1];

            if (checkIsUserInRoleAdminMember(sticky.userId, sticky.projectId)) {
                if (checkMemberCount(memberCountRoleAdmin, memberCountRoleMember)) {
                    var notification_id = Notifications.insert({
                        userId: sticky.userId,
                        projectId: project._id,
                        objectId: sticky._id,
                        author: sticky.author,
                        projectTitle: project.title,
                        stickyTitle: sticky.title,
                        storyTitle: story.title,
                        storyId: story._id,
                        userDeletedSticky: userDeletedSticky.username,
                        type: "stickyDeleted",
                        submitted: new Date().getTime()
                    });
                }

                notificationCounter = addUserNotifications(sticky.projectId, userDeletedSticky._id, 'stickyDeleted', notificationCounter, notification_id);

                checkIfNotificationCounterIsZero(notificationCounter, notification_id);
            }
        }
    },
    createStoryNotification : function(storyId) {
        if(serverVar) {
            var story = UserStories.findOne(storyId);
            var project = Projects.findOne(story.projectId);
            var notificationVars = setNotificationVars(project);
            var isUserInRoleAdmin = notificationVars[0];
            var isUserInRoleMember = notificationVars[1];
            var memberCountRoleAdmin = notificationVars[2];
            var memberCountRoleMember = notificationVars[3];
            var notificationCounter = notificationVars[4];

            var checkMemberAdminCountRolesVars = checkMemberAdminCountRoles(isUserInRoleAdmin, isUserInRoleMember, memberCountRoleAdmin, memberCountRoleMember);
            memberCountRoleAdmin = checkMemberAdminCountRolesVars[0];
            memberCountRoleMember = checkMemberAdminCountRolesVars[1];

            if (checkIsUserInRoleAdminMember(story.userId, story.projectId)) {
                if (checkMemberCount(memberCountRoleAdmin, memberCountRoleMember)) {
                    var notification_id = Notifications.insert({
                        userId: story.userId,
                        projectId: project._id,
                        objectId: story._id,
                        author: story.author,
                        projectTitle: project.title,
                        storyTitle: story.title,
                        type: "storyCreated",
                        submitted: new Date().getTime()
                    });
                }

                notificationCounter = addUserNotifications(story.projectId, story.userId, 'storyCreated', notificationCounter, notification_id);

                checkIfNotificationCounterIsZero(notificationCounter, notification_id);
            }
        }
    },
    editStoryNotification : function(storyId, storyOldTitle) {
        if(serverVar) {
            var story = UserStories.findOne(storyId);
            var project = Projects.findOne(story.projectId);
            var notificationVars = setNotificationVars(project);
            var isUserInRoleAdmin = notificationVars[0];
            var isUserInRoleMember = notificationVars[1];
            var memberCountRoleAdmin = notificationVars[2];
            var memberCountRoleMember = notificationVars[3];
            var notificationCounter = notificationVars[4];

            var checkMemberAdminCountRolesVars = checkMemberAdminCountRoles(isUserInRoleAdmin, isUserInRoleMember, memberCountRoleAdmin, memberCountRoleMember);
            memberCountRoleAdmin = checkMemberAdminCountRolesVars[0];
            memberCountRoleMember = checkMemberAdminCountRolesVars[1];

            if (checkIsUserInRoleAdminMember(story.userId, story.projectId)) {
                if (checkMemberCount(memberCountRoleAdmin, memberCountRoleMember)) {
                    var notification_id = Notifications.insert({
                        userId: story.userId,
                        projectId: project._id,
                        objectId: story._id,
                        author: story.author,
                        projectTitle: project.title,
                        storyTitle: story.title,
                        storyOldTitle: storyOldTitle,
                        lastEdited: story.lastEdited,
                        type: "storyEdited",
                        submitted: new Date().getTime()
                    });
                }

                var userLastEdited = Users.findOne({username: story.lastEdited});
                notificationCounter = addUserNotifications(story.projectId, userLastEdited._id, 'storyEdited', notificationCounter, notification_id);

                checkIfNotificationCounterIsZero(notificationCounter, notification_id);
            }
        }
    },
    deleteStoryNotification : function(storyId, userDeletedStory) {
        if(serverVar) {
            var story = UserStories.findOne(storyId);
            var project = Projects.findOne(story.projectId);
            var notificationVars = setNotificationVars(project);
            var isUserInRoleAdmin = notificationVars[0];
            var isUserInRoleMember = notificationVars[1];
            var memberCountRoleAdmin = notificationVars[2];
            var memberCountRoleMember = notificationVars[3];
            var notificationCounter = notificationVars[4];

            var checkMemberAdminCountRolesVars = checkMemberAdminCountRoles(isUserInRoleAdmin, isUserInRoleMember, memberCountRoleAdmin, memberCountRoleMember);
            memberCountRoleAdmin = checkMemberAdminCountRolesVars[0];
            memberCountRoleMember = checkMemberAdminCountRolesVars[1];

            if (checkIsUserInRoleAdminMember(story.userId, story.projectId)) {
                if (checkMemberCount(memberCountRoleAdmin, memberCountRoleMember)) {
                    var notification_id = Notifications.insert({
                        userId: story.userId,
                        projectId: project._id,
                        objectId: story._id,
                        author: story.author,
                        projectTitle: project.title,
                        storyTitle: story.title,
                        userDeletedStory: userDeletedStory.username,
                        type: "storyDeleted",
                        submitted: new Date().getTime()
                    });
                }

                notificationCounter = addUserNotifications(story.projectId, userDeletedStory._id, 'storyDeleted', notificationCounter, notification_id);

                checkIfNotificationCounterIsZero(notificationCounter, notification_id);
            }
        }
    },
    addUserToProjectNotification : function(projectId, userToAdd) {
        if(serverVar) {
            var project = Projects.findOne(projectId);
            var notificationVars = setNotificationVars(project);
            var isUserInRoleAdmin = notificationVars[0];
            var isUserInRoleMember = notificationVars[1];
            var memberCountRoleAdmin = notificationVars[2];
            var memberCountRoleMember = notificationVars[3];
            var notificationCounter = notificationVars[4];

            var checkMemberAdminCountRolesVars = checkMemberAdminCountRoles(isUserInRoleAdmin, isUserInRoleMember, memberCountRoleAdmin, memberCountRoleMember);
            memberCountRoleAdmin = checkMemberAdminCountRolesVars[0];
            memberCountRoleMember = checkMemberAdminCountRolesVars[1];

            if (checkIsUserInRoleAdminMember(project.userId, project._id) && Roles.getUsersInRole(project._id + '-member').count() > 0) {
                if (checkMemberCount(memberCountRoleAdmin, memberCountRoleMember)) {
                    var notification_id = Notifications.insert({
                        userId: project.userId,
                        projectId: project._id,
                        author: project.author,
                        projectTitle: project.title,
                        userToAdd: userToAdd.username,
                        type: "addUserToProject",
                        submitted: new Date().getTime()
                    });
                }

                notificationCounter = addUserNotifications(project._id, project.userId, 'usersAddedToProject', notificationCounter, notification_id);

                checkIfNotificationCounterIsZero(notificationCounter, notification_id);
            }
        }
    },
    removeUserFromProjectNotification : function(projectId, userToRemove) {
        if(serverVar) {
            var project = Projects.findOne(projectId);
            var notificationVars = setNotificationVars(project);
            var isUserInRoleAdmin = notificationVars[0];
            var isUserInRoleMember = notificationVars[1];
            var memberCountRoleAdmin = notificationVars[2];
            var memberCountRoleMember = notificationVars[3];
            var notificationCounter = notificationVars[4];

            var checkMemberAdminCountRolesVars = checkMemberAdminCountRoles(isUserInRoleAdmin, isUserInRoleMember, memberCountRoleAdmin, memberCountRoleMember);
            memberCountRoleAdmin = checkMemberAdminCountRolesVars[0];
            memberCountRoleMember = checkMemberAdminCountRolesVars[1];

            if (checkIsUserInRoleAdminMember(project.userId, project._id) && Roles.getUsersInRole(project._id + '-member').count() > 0) {
                if (checkMemberCount(memberCountRoleAdmin, memberCountRoleMember)) {
                    var notification_id = Notifications.insert({
                        userId: project.userId,
                        projectId: project._id,
                        author: project.author,
                        projectTitle: project.title,
                        userToRemove: userToRemove.username,
                        type: "removeUserFromProject",
                        submitted: new Date().getTime()
                    });
                }

                notificationCounter = addUserNotifications(project._id, project.userId, 'usersRemovedFromProject', notificationCounter, notification_id);

                checkIfNotificationCounterIsZero(notificationCounter, notification_id);
            }
        }
    }
});
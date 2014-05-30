/**
 * Created by Matthias on 16/04/14.
 */

Accounts.onCreateUser(function (options, user) {
    user.settingsNotifications = {stickyCreated: true, stickyEdited: true, stickyMoved: true,
        stickyDeleted: true, storyCreated: true, storyEdited: true, storyDeleted: true, usersAddedToProject: true,
        usersRemovedFromProject: true, commentAdded: true};
    return user;
});
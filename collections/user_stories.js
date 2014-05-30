/**
 * Created by MrBrown on 03/03/14.
 */

UserStories = new Meteor.Collection('userStories');

UserStories.allow({
    insert: projectAdminOrMember,
    update: projectAdminOrMember,
    remove: projectAdminOrMember
});
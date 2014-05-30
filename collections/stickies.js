/**
 * Created by Matthias on 30/03/14.
 */
Stickies = new Meteor.Collection('stickies');

Stickies.allow({
    insert: projectAdminOrMember,
    update: projectAdminOrMember,
    remove: projectAdminOrMember
});
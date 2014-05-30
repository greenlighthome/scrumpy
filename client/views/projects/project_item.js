/**
 * Created by Matthias on 01/03/14.
 */
Template.projectItem.helpers({
    userIsAdmin: function() {
        return Roles.userIsInRole(Meteor.userId(), this._id + '-admin');
    },
    userIsMember: function() {
        return Roles.userIsInRole(Meteor.userId(), this._id + '-member');
    }
});
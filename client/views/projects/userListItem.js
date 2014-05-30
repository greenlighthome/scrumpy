/**
 * Created by Matthias on 09/03/14.
 */
Template.userListItem.events({
    'click .minus': function(e, t) {
        e.preventDefault();

        var currentProjectId = Router.current().params['_id'];

        var tMemberId = t.data._id;
        if (tMemberId.length > 0) {

            var userToRemove = Users.findOne({_id: tMemberId});

            if (userToRemove) {
                if (Roles.userIsInRole(userToRemove, currentProjectId + '-member')) {

                    Meteor.call('removeUsersFromRoles', userToRemove, currentProjectId + '-member', function(err) {
                        if (err) {
                            Toast.error(err);
                        }
                    });
                    Meteor.call('removeUserFromProjectNotification', currentProjectId, userToRemove, function(err) {
                        if (err) {
                            Toast.error(err);
                        }
                    });
                }
            } else {
                Toast.error("Something went wrong.", "User not found.");
            }
        }
    }
});
/**
 * Created by Matthias on 01/03/14.
 */

Template.projectsList.helpers({
    emptyProjects: function() {
        return Roles.getRolesForUser(Meteor.userId()) == 0;
    }
});
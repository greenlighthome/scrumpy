/**
 * Created by Matthias on 08/03/14.
 */

Meteor.roles.deny({
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
    removeUsersFromRoles: function(user, role) {
        if(serverVar) {
            Roles.removeUsersFromRoles(user, role);
        }
    },
    deleteRoles: function(adminRole, memberRole) {
        if(serverVar) {
            Roles.deleteRole(adminRole);
            Roles.deleteRole(memberRole);
        }
    },
    removeUsersFromRoles: function(userToRemove, role) {
        if(serverVar) {
            Roles.removeUsersFromRoles(userToRemove, role);
        }
    },
    addUsersToRoles: function(userToAdd, role) {
        if(serverVar) {
            Roles.addUsersToRoles(userToAdd, role);
        }
    }
});
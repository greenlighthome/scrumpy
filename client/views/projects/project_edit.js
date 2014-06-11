var currentProjectId;

Template.projectEdit.events({

    'submit form': function(e) {
        e.preventDefault();

        var redirectAllowed = false;
        var projectProperties = {
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val(),
            lastModified: new Date().getTime()
        }

        Projects.update(currentProjectId, {$set: projectProperties}, function(error) {
            if (error) {
                throwError(error.reason);
            } else {
                if ($(e.target).find('[name=members]').val().length > 0) {
                    var userToAdd = Meteor.users.findOne({'username': $(e.target).find('[name=members]').val()});
                    if (addUserToProject(userToAdd)) {
                        redirectAllowed = true;
                    } else {
                        $(e.target).find('[name=members]').val("");
                    }
                } else {
                    redirectAllowed = true;
                }
                if (redirectAllowed) {
                    Router.go('projectPage', {_id: currentProjectId});
                }
            }
        });
    },
    'click .delete': function(e) {
        e.preventDefault();
        if (confirm('Delete project?')) {
            Projects.remove(currentProjectId);

            Roles.getUsersInRole(currentProjectId + '-admin').forEach(function (user) {
                Meteor.call('removeUsersFromRoles', user, currentProjectId + '-admin', function(err) {
                    if (err) {
                        Toast.error(err);
                    }
                });
            });
            Roles.getUsersInRole(currentProjectId + '-member').forEach(function (user) {
                Meteor.call('removeUsersFromRoles', user, currentProjectId + '-member', function(err) {
                    if (err) {
                        Toast.error(err);
                    }
                });
            });

            Meteor.call('deleteRoles', currentProjectId + '-admin', currentProjectId + '-member', function(err) {
                if (err) {
                    Toast.error(err);
                }
            });

            Meteor.call('removeBurndown', currentProjectId, function(err) {
                if (err) {
                    Toast.error(err);
                }
            });

            Router.go('projectsList');

        }
    },
    'click .addMember': function(e, t) {
        e.preventDefault();

        var tMember = t.find('[name=members]');

        if (tMember.value.length > 0) {

            var userToAdd = Meteor.users.findOne({'username': tMember.value});
            addUserToProject(userToAdd);
            tMember.value = "";

        } else {
            Toast.error('Users selected will be allowed to contribute to the project', 'Please add a user');
        }
    },

    'click .deleteMember': function(e, t) {
        e.preventDefault();

        var tMember = t.find('[name=members]');

        if (tMember.value.length > 0) {
            // find user object
            var userToRemove = Meteor.users.findOne({'username': tMember.value});

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
                Meteor.call('reduceMembersCount', currentProjectId, function(err) {
                    if (err) {
                        Toast.error(err);
                    }
                });
            }
            tMember.value = "";
        }
    }
});

Template.memberAutoComplete.rendered = function() {
    AutoCompletion.init("input#memberAutocomplete");
    AutoCompletion.enableLogging = false;
}

Template.memberAutoComplete.events ({
    'keyup input#memberAutocomplete': function (e, t) {
        e.preventDefault();

        AutoCompletion.autocomplete({
            element: 'input#memberAutocomplete',
            collection: Users,
            field: 'username',
            limit: 0,
            filter: { 'username': {$ne: Meteor.user().username} }});

        var tMemberInput = t.find('[name=members]');

        if (tMemberInput.value.length > 0) {
            var addButton = t.find('[name=addDeleteButton]');
            if (Roles.userIsInRole(Meteor.users.findOne({'username': tMemberInput.value}), currentProjectId + '-member')) {
                addButton.firstChild.className = addButton.firstChild.className.replace("fa-plus text-success", "fa-minus minus text-danger");
                addButton.className = addButton.className.replace("addMember", "deleteMember");
            } else {
                addButton.firstChild.className = addButton.firstChild.className.replace("fa-minus minus text-danger", "fa-plus text-success");
                addButton.className = addButton.className.replace("deleteMember", "addMember");
            }
        }
    }
});

Template.projectEdit.rendered = function() {
    currentProjectId = this.data._id;

    $('.ui-autocomplete').on('click', '.ui-menu-item', function(){
        var addButton = $('[name="addDeleteButton"]')[0];
        var tMemberInput = $('[name="members"]')[0];

        if (Roles.userIsInRole(Meteor.users.findOne({'username': tMemberInput.value}), currentProjectId + '-member')) {
            addButton.firstChild.className = addButton.firstChild.className.replace("fa-plus text-success", "fa-minus minus text-danger");
            addButton.className = addButton.className.replace("addMember", "deleteMember");
        } else {
            addButton.firstChild.className = addButton.firstChild.className.replace("fa-minus minus text-danger", "fa-plus text-success");
            addButton.className = addButton.className.replace("deleteMember", "addMember");
        }
    });
};

Template.projectEdit.helpers({
    membersInGroup : function() {
        return Roles.getUsersInRole(this._id + '-member').fetch().length > 0;
    },
    member: function() {
        return Roles.getUsersInRole(this._id + '-member').fetch();
    }
});

function addUserToProject(userToAdd) {
    if (!userToAdd) {
        Toast.error('The user supplied does not exist in the system database', 'The user does not exist');
        return false;
    } else if (Roles.userIsInRole(userToAdd, currentProjectId + '-admin') || Roles.userIsInRole(userToAdd, currentProjectId + '-member')) {
        Toast.error('User ' + userToAdd.username + ' is already part of your project.', 'Please add a different user.');
        return false;
    } else if (Meteor.user()._id === userToAdd._id){
        Toast.error("You are the administrator of this project.", "You can't add yourself to the project.");
        return false;
    } else {
        Meteor.call('addUserToProjectNotification', currentProjectId, userToAdd, function(err) {
            if (err) {
                Toast.error(err);
            }
        });
        Meteor.call('addUsersToRoles', userToAdd, currentProjectId + '-member', function(err) {
            if (err) {
                Toast.error(err);
            }
        });
        Meteor.call('increaseMembersCount', currentProjectId, function(err) {
            if (err) {
                Toast.error(err);
            }
        });
        return true;
    }
};
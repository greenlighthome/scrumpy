/**
 * Created by Matthias on 01/03/14.
 */
Projects = new Meteor.Collection('projects');

Projects.allow({
    update: ownsDocumentOrAdmin,
    remove: ownsDocument
});

var serverVar = false;
if(Meteor.isServer) {
    serverVar = true;
}

Meteor.methods({
    project: function(projectAttributes) {
        var user = Meteor.user();

        // ensure the user is logged in
        if (!user) {
            throw new Meteor.Error(401, "You need to login to create a new project", "Please log in");
        }
        // ensure the project has a title
        if (!projectAttributes.title) {
            throw new Meteor.Error(422, "Please fill in a title", "Title is empty");
        }

        // pick out the whitelisted keys
        var project = _.extend(_.pick(projectAttributes, 'title', 'description'), {
            userId: user._id,
            author: user.username,
            submitted: new Date().getTime(),
            lastModified: new Date().getTime(),
            commentsCount: 0
        });

        var projectId = Projects.insert(project);

        Burndown.insert({projectId: projectId});

        // create roles for this project
        Roles.createRole(projectId + '-member');
        // automatically create role <projectId>-admin + add author to role
        Roles.addUsersToRoles(user._id, projectId + '-admin');
        return projectId;
    },
    reduceCommentsCount: function(projectId, commentsCount) {
        if(serverVar) {
            Projects.update({_id: projectId}, {$set:{commentsCount: commentsCount - 1}});
        }
    }
});
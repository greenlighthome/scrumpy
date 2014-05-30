/**
 * Created by Matthias on 19/03/14.
 */

Comments = new Meteor.Collection('comments');

Meteor.methods({
    comment: function(commentAttributes) {
        var user = Meteor.user();
        var project = Projects.findOne(commentAttributes.projectId); // ensure the user is logged in
        if (!user) {
            throw new Meteor.Error(401, "You need to login to make comments");
        }
        if (!commentAttributes.body) {
            throw new Meteor.Error(422, 'Please write some content');
        }
        if (!project) {
            throw new Meteor.Error(422, 'You must comment on a project');
        }

        comment = _.extend(_.pick(commentAttributes, 'projectId', 'body'), {
            userId: user._id,
            author: user.username,
            projectId: project._id,
            submitted: new Date().getTime()
        });

        // update the project with the number of comments
        Projects.update(comment.projectId, {$inc: {commentsCount: 1}, $set:{lastModified: new Date().getTime()}});

        comment._id = Comments.insert(comment);

        Meteor.call('createCommentNotification', comment, function(err) {
            if (err) {
                Toast.error(err);
            }
        });

        return comment._id;
    }
});

Comments.allow({
    update: ownsDocumentOrAdmin,
    remove: ownsDocumentOrAdmin
});
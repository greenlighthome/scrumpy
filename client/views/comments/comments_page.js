/**
 * Created by Matthias on 19/03/14.
 */

Template.commentsPage.helpers({
    comments: function() {
        return Comments.find({projectId: this._id});
    }
});
/**
 * Created by Matthias on 19/03/14.
 */
Template.commentSubmit.events({
    'submit form': function(e, template) {
        e.preventDefault();
        var $body = $(e.target).find('[name=body]');
        var comment = {
            body: $body.val(),
            projectId: template.data._id
        };

        Meteor.call('comment', comment, function(error) {
            if (error){
                throwError(error.reason);
            } else {
                $body.val('');
            }
        });
    }
});
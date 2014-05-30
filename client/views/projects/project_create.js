/**
 * Created by Matthias on 01/03/14.
 */
Template.projectCreate.events({
    'submit form': function(e) {
        e.preventDefault();

        var project = {
            title: $(e.target).find('[name=title]').val(),
            description: $(e.target).find('[name=description]').val()
        }
        Meteor.call('project', project, function(error, id) {
            if (error) {
                throwError(error.reason, error.details);
                return null;
            }
            Toast.success('Success');
            Router.go('projectPage', {_id: id});
        });
    }
});
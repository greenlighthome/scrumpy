/**
 * Created by Matthias on 19/03/14.
 */

Template.errors.helpers({
    errors: function() {
        return Errors.find();
    }
});

Template.errors.error = function() {
    return Toast.error(this.details, this.message);
};
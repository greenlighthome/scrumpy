/**
 * Created by Matthias on 19/03/14.
 */
Template.comment.helpers({
    submittedText: function() {
        var dateCommentCreated = new Date(this.submitted);
        var day = dateCommentCreated.getDate();
        var month = dateCommentCreated.getMonth() + 1;
        var year = dateCommentCreated.getFullYear();
        var actualDate = (day <= 9 ? '0' + day : day) + "." + (month<=9 ? '0' + month : month) + "." + year + " - " + (dateCommentCreated.getHours() <= 9 ? '0' + dateCommentCreated.getHours() : dateCommentCreated.getHours()) + ":" + (dateCommentCreated.getMinutes() <= 9 ? '0' + dateCommentCreated.getMinutes() : dateCommentCreated.getMinutes());
        return actualDate;
    },
    adminOrOwnerOfComment: function() {
        return (this.userId == Meteor.userId()) || Roles.userIsInRole(Meteor.userId(), this.projectId + '-admin');
    }
});

var editInputActive = false;

Template.comment.events({
    'click .deleteComment': function(e) {
        e.preventDefault();

        Comments.remove(this._id);

        var commentsCount = Projects.findOne({_id: this.projectId}).commentsCount;
        Meteor.call('reduceCommentsCount', this.projectId, commentsCount, function(err) {
            if (err) {
                Toast.error(err);
            }
        });
    },

    'click .editComment': function(e, t) {
        e.preventDefault();

        var divBodyTxt= t.find('[class=commentBody]');

        if (!editInputActive) {

            var divBodyTxtChildP = divBodyTxt.firstChild;

            var editCommentInput = document.createElement("input");
            editCommentInput.name = "editCommentInput";
            editCommentInput.type = "text";
            editCommentInput.className = "editCommentInput"; // set the CSS class
            editCommentInput.value = divBodyTxtChildP.innerHTML; // get comment text

            var editCommentSubmitButton = document.createElement("button");
            editCommentSubmitButton.name = "editCommentSubmitButton";
            editCommentSubmitButton.className = "glyphicon glyphicon-ok btn btn-success btn-xs editCommentSubmitButton";

            var editCommentCancelButton = document.createElement("button");
            editCommentCancelButton.name = "editCommentCancelButton";
            editCommentCancelButton.className = "glyphicon glyphicon-remove btn btn-danger btn-xs editCommentCancelButton";

            divBodyTxt.appendChild(editCommentInput);
            divBodyTxt.appendChild(editCommentSubmitButton);
            divBodyTxt.appendChild(editCommentCancelButton);
            divBodyTxt.removeChild(divBodyTxtChildP);

            editInputActive = true;

        } else {
            removeCommentInput(e, t);
        }
    },

    'click .editCommentSubmitButton': function(e, t) {
        e.preventDefault();

        var divBodyTxt= t.find('[class=commentBody]');
        var editCommentInput = divBodyTxt.firstChild;
        var updatedCommentTxt = editCommentInput.value;

        Comments.update({_id: this._id}, {$set:{body: updatedCommentTxt}});

        removeCommentInput(e, t);
    },

    'click .editCommentCancelButton': function(e, t) {
        removeCommentInput(e, t);
    }
});

function removeCommentInput(e, t) {
    e.preventDefault();

    var divBodyTxt= t.find('[class=commentBody]');

    var editCommentInput = divBodyTxt.firstChild;
    var editCommentSubmitButton = divBodyTxt.childNodes[1];
    var editCommentCancelButton = divBodyTxt.lastChild;

    var commentTxtP = document.createElement("p");
    commentTxtP.innerHTML = editCommentInput.value;

    divBodyTxt.appendChild(commentTxtP);
    divBodyTxt.removeChild(editCommentInput);
    divBodyTxt.removeChild(editCommentSubmitButton);
    divBodyTxt.removeChild(editCommentCancelButton);

    editInputActive = false;

}
Template.userStoriesList.helpers({
    userStories: function() {
        return UserStories.find({projectId: this._id});
    },
    stickyType: function(type) {
        return Stickies.find({storyId: this._id, status: type});
    }
});

var storyId;
var stickyId;
var projectId;

Template.userStoriesList.events({

    'click .newStory': function(e, t) {
        e.preventDefault();

        var buttonNewStory = t.find('[name=newStory]');

        var newStoryInput = document.createElement("input");
        newStoryInput.name = "newStoryInput";
        newStoryInput.type = "text";
        newStoryInput.className = "newStoryInput";

        newStoryTd = buttonNewStory.parentNode;
        newStoryTd.removeChild(buttonNewStory);
        newStoryTd.appendChild(newStoryInput);

        var divControlButtons = document.createElement("div");
        divControlButtons.className = "divControlButtons";

        newStoryTd.appendChild(divControlButtons);

        var newStorySubmitButton = document.createElement("button");
        newStorySubmitButton.name = "newStorySubmit";
        newStorySubmitButton.className = "glyphicon glyphicon-ok btn btn-success btn-xs newStorySubmit";
        divControlButtons.appendChild(newStorySubmitButton);

        var newStoryCancelButton = document.createElement("button");
        newStoryCancelButton.name = "newStoryCancel";
        newStoryCancelButton.className = "glyphicon glyphicon-remove btn btn-danger btn-xs newStoryCancel";
        divControlButtons.appendChild(newStoryCancelButton);
    },

    'click .newStorySubmit': function(e, t) {
        e.preventDefault();

        var newStoryInput = t.find('[name=newStoryInput]');

        if (newStoryInput.value.length > 0) {
            var user = Meteor.user();
            var newStory = {userId: user._id, title: newStoryInput.value, projectId: this._id,
                submitted: new Date().getTime(), author: Meteor.user().username,
                lastEdited: Meteor.user().username};
            var storyId = UserStories.insert(newStory);

            removeCancelNewStory(e, t);

            updateLastModified();

            Meteor.call('createStoryNotification', storyId, function(err) {
                if (err) {
                    Toast.error(err);
                }
            });
        } else {
            Toast.warning('Chose a title that reflect the feature to be implemented', 'Choose a title');
        }
    },

    'click .newStoryCancel': function(e, t) {
        e.preventDefault();
        removeCancelNewStory(e, t);
    },

    'click .newToDo': function(e) {
        e.preventDefault();
        e.stopPropagation();
        storyId = this._id;
        displayModal('#stickyAddModal', '#stickyEditModal');
    },

    'click .submitNewToDo': function(e) {
        e.preventDefault();
        var toDoName = document.getElementById("toDoName").value;

        document.getElementById("toDoName").value = "";

        if (toDoName.length > 0) {
            var user = Meteor.user();
            var newSticky = {userId: user._id, title: toDoName, projectId: this._id, storyId: storyId,
                status: "ToDo", submitted: new Date().getTime(), author: user.username,
                lastMoved: user.username, lastEdited: user.username};
            var stickyId = Stickies.insert(newSticky);

            $('#stickyAddModal').modal('hide');

            updateLastModified();

            Meteor.call('createStickyNotification', stickyId, function(err) {
                if (err) {
                    Toast.error(err);
                }
            });
            Meteor.call('updateBurndown', this._id, function(err) {
                if (err) {
                    Toast.error(err);
                }
            });
        } else {
            Toast.error("Please name your new Sticky.", "Title missing!")
        }
    },
    'click .deleteSticky': function(e) {
        e.preventDefault();
        Meteor.call('deleteStickyNotification', this._id, Meteor.user(), function(err) {
            if (err) {
                Toast.error(err);
            }
        });

        var projectId = Stickies.findOne(this._id).projectId;


        Stickies.remove(this._id);

        Meteor.call('updateBurndown', projectId , function(err) {
            if (err) {
                Toast.error(err);
            }
        });

        updateLastModified();


    },

    'click .editSticky': function(e) {
        e.preventDefault();

        displayModal('#stickyEditModal', '#stickyAddModal');

        document.getElementById("stickyName").value = this.title;
        stickyId = this._id;
    },

    'click .editStickySubmit': function(e) {
        e.preventDefault();

        var stickyName = document.getElementById("stickyName").value;

        document.getElementById("stickyName").value = "";

        if (stickyName.length > 0) {
            var stickyOldTitle = Stickies.findOne({_id: stickyId}).title;

            Stickies.update({_id: stickyId}, {$set:{title: stickyName, lastEdited: Meteor.user().username}});

            $('#stickyEditModal').modal('hide');

            if (stickyName != stickyOldTitle) {
                updateLastModified();

                Meteor.call('editStickyNotification', stickyId, stickyOldTitle, function(err) {
                    if (err) {
                        Toast.error(err);
                    }
                });
            }
        } else {
            Toast.error("Please name your Sticky.", "Title missing!")
        }
    },

    'click .deleteStory': function(e) {
        e.preventDefault();

        var stickiesToStory = Stickies.find({storyId: this._id}).fetch();

        for (var i = 0; i < stickiesToStory.length; i++) {
            Stickies.remove(stickiesToStory[i]._id);
        }

        Meteor.call('deleteStoryNotification', this._id, Meteor.user(), function(err) {
            if (err) {
                Toast.error(err);
            }
        });

        Meteor.call('updateBurndown', UserStories.findOne(this._id).projectId, function(err) {
            if (err) {
                Toast.error(err);
            }
        });

        UserStories.remove(this._id);

        updateLastModified();

    },

    'click .editStory': function(e, t) {
        e.preventDefault();

        var editedStory = UserStories.findOne({_id: this._id});

        var editStoryInput = document.createElement("input");
        editStoryInput.name = "editStoryInput";
        editStoryInput.type = "text";
        editStoryInput.className = "editStoryInput"; // set the CSS class

        var editStoryTd = e.target.parentElement.parentNode.parentNode;

        editStoryTd.removeChild(getFirstChild(editStoryTd));

        editStoryInput.value = editedStory.title;

        var divStoryInput = document.createElement("div");
        divStoryInput.className = "story-input";

        editStoryTd.appendChild(divStoryInput);
        divStoryInput.appendChild(editStoryInput);

        var divControlButtons = document.createElement("div");
        divControlButtons.className = "divControlButtons";

        divStoryInput.appendChild(divControlButtons);

        var editStorySubmitButton = document.createElement("button");
        editStorySubmitButton.name = "editStorySubmit";
        editStorySubmitButton.className = "glyphicon glyphicon-ok btn btn-success btn-xs editStorySubmit";
        divControlButtons.appendChild(editStorySubmitButton);

        var editStoryCancelButton = document.createElement("button");
        editStoryCancelButton.name = "editStoryCancel";
        editStoryCancelButton.className = "glyphicon glyphicon-remove btn btn-danger btn-xs editStoryCancel";
        divControlButtons.appendChild(editStoryCancelButton);
    },

    'click .editStoryCancel': function(e, t) {
        e.preventDefault();

        var storyId = this._id;
        removeCancelEditStory(e, t, storyId);
    },

    'click .editStorySubmit': function(e, t) {
        e.preventDefault();

        var editStoryInput = t.find('[name=editStoryInput]');
        var storyOldTitle;

        if (editStoryInput.value.length > 0) {

            storyOldTitle = UserStories.findOne({_id: this._id}).title;

            UserStories.update({_id: this._id}, {$set:{title: editStoryInput.value, lastEdited: Meteor.user().username}});
            var storyId = this._id;

            removeCancelEditStory(e, t, storyId);

            if (editStoryInput.value != storyOldTitle) {
                updateLastModified();
                Meteor.call('editStoryNotification', this._id, storyOldTitle, function(err) {
                    if (err) {
                        Toast.error(err);
                    }
                });
                Toast.success("Story updated.");
            }
        } else {
            Toast.warning('Chose a title that reflect the feature to be implemented', 'Choose a title');
        }
    }
});

function removeCancelNewStory(e, t) {
    var newStoryCancelButton = t.find('[name=newStoryCancel]');
    divControlButtons = newStoryCancelButton.parentNode;
    divControlButtons.removeChild(newStoryCancelButton);

    newStoryTd = divControlButtons.parentNode;

    var newStorySubmitButton = t.find('[name=newStorySubmit]');
    divControlButtons.removeChild(newStorySubmitButton);

    newStoryTd.removeChild(divControlButtons);

    var newStoryInput = t.find('[name=newStoryInput]');
    newStoryTd.removeChild(newStoryInput);

    var newStoryButton = document.createElement("button");
    newStoryButton.name = "newStory";
    newStoryButton.className = "btn btn-default newStory";
    newStoryButton.innerHTML = "New Story";
    newStoryTd.appendChild(newStoryButton);
}

function removeCancelEditStory(e, t, storyId) {
    var editStoryCancelButton = t.find('[name=editStoryCancel]');
    divControlButtons = editStoryCancelButton.parentNode;
    divControlButtons.removeChild(editStoryCancelButton);

    editStoryTd = divControlButtons.parentNode;

    var editStorySubmitButton = t.find('[name=editStorySubmit]');
    divControlButtons.removeChild(editStorySubmitButton);

    editStoryTd.removeChild(divControlButtons);

    var editStoryInput = t.find('[name=editStoryInput]');
    editStoryTd.removeChild(editStoryInput);


    var divStory = document.createElement("div");
    divStory.className = "story";


    var textArea = document.createElement("div"); // <-----  added
    textArea.className = "text-area";  // <-----  added


    var pStory = document.createElement("p");

    var editedStory = UserStories.findOne({_id: storyId});

    pStory.innerHTML = editedStory.title;

    var divStickerControl = document.createElement("div");
    divStickerControl.className = "story-control";

    var buttonDeleteStory = document.createElement("button");
    var buttonEditStory = document.createElement("button");
    buttonDeleteStory.className = "glyphicon glyphicon-remove btn btn-danger btn-xs deleteStory";
    buttonEditStory.className = "glyphicon glyphicon-pencil btn btn-default btn-xs editStory";
    divStory.appendChild(textArea);   // <-----  added
    textArea.appendChild(pStory);
    divStory.appendChild(divStickerControl);
    divStickerControl.appendChild(buttonDeleteStory);
    divStickerControl.appendChild(buttonEditStory);
    editStoryTd.appendChild(divStory);
}

Template.userStoriesList.rendered = function() {
    projectId = Router.current().params['_id'];
}

Template.sticky.rendered = function() {
    REDIPS.drag.init();
    // reference to the REDIPS.drag library
    var rd = REDIPS.drag;

    // define event.dropped handler
    rd.event.dropped = function () {
        var pos = rd.getPosition();
        var stickyId = rd.obj.getAttribute('id');
        var storyId = rd.td.current.parentNode.getAttribute('id');
        if (pos[2] == 2) {
            updateStickyPosition(stickyId, "ToDo");
            checkMovementBackFromDone(rd, projectId);
        } else if (pos[2] == 3) {
            updateStickyPosition(stickyId, "Started");
            checkMovementBackFromDone(rd, projectId);
        } else if (pos[2] == 4) {
            updateStickyPosition(stickyId, "Verify");
            checkMovementBackFromDone(rd, projectId);
        } else if (pos[2] == 5) {
            updateStickyPosition(stickyId, "Done");
            Meteor.call('updateBurndown', projectId, function(err) {
                if (err) {
                    Toast.error(err);
                }
            });
        }
        Stickies.update({_id: stickyId}, {$set:{storyId: storyId, lastMoved: Meteor.user().username}});

        if (rd.td.current != rd.td.previous && (pos[1] != pos[4] || pos[2] != pos[5])) {

            updateLastModified();
            Meteor.call('moveStickyNotification', stickyId, function(err, response) {
                if (err) {
                    Toast.error(err);
                }
            });
        }
    };
}

function updateLastModified() {
    Projects.update({_id: projectId}, {$set:{lastModified: new Date().getTime()}});
}

function updateStickyPosition(stickyId, location) {
    Stickies.update({_id: stickyId}, {$set:{status: location, lastMoved: Meteor.user().username}});
}

function displayModal(idToShow, idToHide) {
    $(idToShow).modal('show');
    $(idToHide).modal('hide');
}

// workaround to skip TextNodes
function getFirstChild(el){
    var firstChild = el.firstChild;
    while(firstChild != null && firstChild.nodeType == 3) {
        firstChild = firstChild.nextSibling;
    }
    return firstChild;
}

function checkMovementBackFromDone(rd, projectId) {
    if (rd.td.source.className == "done") {
        Meteor.call('updateBurndown', projectId, function(err) {
            if (err) {
                Toast.error(err);
            }
        });
    }
}
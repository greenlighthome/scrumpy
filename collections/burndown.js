/**
 * Created by Matthias on 01/05/14.
 */

Burndown = new Meteor.Collection('burndown');

var serverVar = false;
if(Meteor.isServer) {
    serverVar = true;
}

Meteor.methods({
    updateBurndown: function(projectId) {
        if(serverVar) {
            var burndownData = Burndown.findOne({projectId: projectId});
            if(burndownData) {
                var dateNow = new Date();
                var dateString = dateNow.getDate() + "." + (dateNow.getMonth() + 1) + "." + dateNow.getFullYear();
                var stickiesNumber = Stickies.find({projectId: projectId, status: { $in: ["ToDo", "Started", "Verify"]}}).count();
                if (!burndownData.data || !arrayContainsElement(burndownData.data, dateString)) {
                    Burndown.update({projectId: projectId}, { $push: { data: {date: dateString, numberOfStickies: stickiesNumber}}});
                } else {
                    Burndown.update({projectId: projectId, "data.date": dateString}, { $set: { "data.$.numberOfStickies": stickiesNumber}});
                }
            }
        }
    },
    removeBurndown: function(projectId) {
        if(serverVar) {
            Burndown.remove({projectId: projectId});
        }
    }

});

function arrayContainsElement(arr, el) {
    var i = arr.length;
    while (i--) {
        if (arr[i].date === el) {
            return true;
        }
    }
    return false;
}
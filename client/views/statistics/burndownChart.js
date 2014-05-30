/**
 * Created by Matthias on 01/05/14.
 */

var labels = new Array();
var idealEffort = new Array();
var actualEffort = new Array();

Template.burndownChartPage.rendered = function() {
    Deps.autorun(function () {
        var projectId = Router.current().params['_id'];
        var project = Projects.findOne({_id: projectId});
        if (project) {
            var dateProjectCreated = new Date(project.submitted);
            var startDate = dateProjectCreated;
            var numberOfStickiesInProject = Stickies.find({projectId: projectId}).count();
            var idealEffortCounter = numberOfStickiesInProject;

            while(labels.length > 0) {
                labels.pop();
            }

            while(idealEffort.length > 0) {
                idealEffort.pop();
            }

            while(actualEffort.length > 0) {
                actualEffort.pop();
            }

            var burndownData = Burndown.findOne({projectId: projectId});

            for (var i = 0; i < 31; i++) {
                if (i != 0) {
                    startDate.setDate(startDate.getDate() + 1);
                    idealEffortCounter -= (numberOfStickiesInProject/30)
                }
                var day = startDate.getDate();
                var month = startDate.getMonth() + 1;
                var year = startDate.getFullYear();
                var actualDate = (day <= 9 ? '0' + day : day) + "." + (month<=9 ? '0' + month : month) + "." + year;
                labels.push(actualDate);
                idealEffort.push(idealEffortCounter);
            }

            if (burndownData) {
                for (var j = 0; j < burndownData.data.length; j++) {
                    if (burndownData.data.length < 30) {
                        actualEffort.push(burndownData.data[j].numberOfStickies);
                    }
                }
            }

            $( document ).ready(function() {
                var burndownChart = document.getElementById("burndownChart");
                if (burndownChart) {
                    //Get the context of the canvas element we want to select
                    var ctx = document.getElementById("burndownChart").getContext("2d");
                    var myBurndownChart = new Chart(ctx).Line(data,{bezierCurve : false, scaleOverride: true, scaleStepWidth: 2, scaleSteps: numberOfStickiesInProject/2});
                }
            });
        }
    });
}

var data = {
    labels : labels,
    datasets : [
        {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : idealEffort
        },
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : actualEffort
        }
    ]
}

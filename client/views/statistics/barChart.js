/**
 * Created by Matthias on 01/05/14.
 */

var countData = new Array();


Template.barChartPage.rendered = function() {
    Deps.autorun(function () {
        var projectId = Router.current().params['_id'];
        var toDoCount = Stickies.find({projectId: projectId, status: "ToDo"}).count();
        var startedCount = Stickies.find({projectId: projectId, status: "Started"}).count();
        var verifyCount = Stickies.find({projectId: projectId, status: "Verify"}).count();
        var doneCount = Stickies.find({projectId: projectId, status: "Done"}).count();

        while(countData.length > 0) {
            countData.pop();
        }
        countData.push(toDoCount, startedCount, verifyCount, doneCount);


        $( document ).ready(function() {
            var barChart = document.getElementById("barChart");
            if (barChart) {
                //Get the context of the canvas element we want to select
                var ctx = document.getElementById("barChart").getContext("2d");
                var myBarChart = new Chart(ctx).Bar(data,{scaleOverride: true, scaleStepWidth: 1, scaleSteps: (toDoCount + startedCount + verifyCount + doneCount)});
            }
        });
    });
}

var data = {
    labels : ["ToDo", "Started", "Verify", "Done"],
    datasets : [
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            data : countData
        }
    ]
}
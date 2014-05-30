/**
 * Created by Matthias on 01/03/14.
 */

var notificationIdsArray;
var l;

var memberAdminFilter = function(pause) {
    if (Meteor.user()) {
        Meteor.subscribe('ownUser', Meteor.userId());
        if (($.inArray(this.params._id + '-admin', Meteor.user().roles) == -1) &&
            ($.inArray(this.params._id + '-member', Meteor.user().roles) == -1)) {
            this.render('noAccess');
            pause();
        }
    }
}

var adminFilter = function(pause) {
    if (Meteor.user()) {
        Meteor.subscribe('ownUser', Meteor.userId());
        if (($.inArray(this.params._id + '-admin', Meteor.user().roles) == -1)) {
            this.render('noAccessToEdit');
            pause();
        }
    }
}

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        if (Meteor.user() !== undefined) {
            //user is ready
            if (Meteor.user() && Meteor.user().notifications) {
                //user is logged in
                notificationIdsArray=[],l=Meteor.user().notifications.length;
                while(l--){notificationIdsArray[l]=Meteor.user().notifications[l]._id};
            }
        }
        if (notificationIdsArray) {
            return [Meteor.subscribe('notifications', notificationIdsArray)];
        }
    }
});

ProjectsListController = RouteController.extend({
    template: 'projectsList',
    increment: 5,
    projectIds: function() {
        var projectIds = Roles.getRolesForUser(Meteor.userId());
        for (var i = 0; i < projectIds.length; i++) {
            projectIds[i] = projectIds[i].substring(0, projectIds[i].indexOf('-'));
        }
        return projectIds;
    },
    limit: function() {
        return parseInt(this.params.projectsLimit) || this.increment;
    },
    findOptions: function() {
        return {sort: {lastModified: -1}, limit: this.limit()};
    },
    waitOn: function() {
        return Meteor.subscribe('projects', this.findOptions(), this.projectIds());
    },
    projects: function() {
        return Projects.find({_id: {$in: this.projectIds()}}, this.findOptions());
    },
    data: function() {
        var hasMore = this.projects().fetch().length === this.limit();
        var nextPath = this.route.path({projectsLimit: this.limit() + this.increment});
        return {
            projects: this.projects(),
            nextPath: hasMore ? nextPath : null
        };
    }
});

Router.map(function() {
    this.route('start', {path: '/'});
    this.route('projectPage', {
        path: '/project/:_id/',
        onBeforeAction: memberAdminFilter,
        disableProgress: true,
        action: function() {
            this.redirect('/project/' + this.params._id + '/scrum-board');
        }
    });
    this.route('projectPage', {
        path: '/project/:_id/scrum-board',
        onBeforeAction: memberAdminFilter,
        waitOn: function() { return [Meteor.subscribe('userStories', this.params._id),
            Meteor.subscribe('stickies', this.params._id),
            Meteor.subscribe('singleProject', this.params._id)]; },
        data: function() { return Projects.findOne(this.params._id); }
    });
    this.route('projectCreate', {
        path: '/create',
        disableProgress: true // disable iron-router-progress since it doesn't need to wait for any subscription data
    });
    this.route('projectEdit', {
        path: '/project/:_id/edit',
        onBeforeAction: adminFilter,
        waitOn: function() { return [Meteor.subscribe('usernamesRoles'),
            Meteor.subscribe('singleProject', this.params._id)];
        },
        data: function() { return Projects.findOne(this.params._id); }
    });
    this.route('commentsPage', {
        path: '/project/:_id/comments',
        onBeforeAction: memberAdminFilter,
        data: function() { return Projects.findOne(this.params._id); },
        waitOn: function() {
            return [Meteor.subscribe('comments', this.params._id), Meteor.subscribe('singleProject', this.params._id)];
        }
    });
    this.route('statisticsPage', {
        path: '/project/:_id/statistics',
        onBeforeAction: memberAdminFilter,
        disableProgress: true,
        action: function() {
            this.redirect('/project/' + this.params._id + '/statistics/burndown-chart');
        }
    });
    this.route('burndownChartPage', {
        path: '/project/:_id/statistics/burndown-chart',
        onBeforeAction: memberAdminFilter,
        data: function() { return Projects.findOne(this.params._id); },
        waitOn: function() { return [Meteor.subscribe('singleProject', this.params._id),
            Meteor.subscribe('stickies', this.params._id), Meteor.subscribe('burndown', this.params._id)]}
    });
    this.route('barChartPage', {
        path: '/project/:_id/statistics/bar-chart',
        onBeforeAction: memberAdminFilter,
        data: function() { return Projects.findOne(this.params._id); },
        waitOn: function() { return [Meteor.subscribe('singleProject', this.params._id),
            Meteor.subscribe('stickies', this.params._id)]}
    });
    this.route('projectsList', {
        path: '/projects/:projectsLimit?',
        controller: ProjectsListController
    });
    this.route('settingsPage', {
        path: '/settings',
        data: function() { return Users.findOne(Meteor.userId()); },
        waitOn: function() {
            if (Meteor.userId()) {
                return Meteor.subscribe('ownUser', Meteor.userId());
            }
        }
    });
});

var requireLogin = function(pause) {
    if (! Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
        pause();
    }
}

Router.onBeforeAction(requireLogin, {only:
    ['projectCreate',  'projectPage', 'projectEdit', 'settingsPage', 'statisticsPage', 'commentsPage', 'lineChartPage', 'barChartPage']});
Router.onBeforeAction(function() {
    clearErrors();
});
Template.navigation.rendered = function() {
    $(".login").popover({
        html: true,
        title: '',
        content: 'Logout / Settings',
        placement: 'bottom',
        trigger: 'manual',
        delay: { show: 500, hide: 100 }
    });
    $(".notifications").popover({
        html: true,
        title: '',
        content: 'Notifications',
        placement: 'top',
        trigger: 'manual',
        delay: { show: 500, hide: 100 }
    });
    $("#new-project").popover({
        html: true,
        title: '',
        content: 'Create a new project',
        placement: 'top',
        trigger: 'manual',
        delay: { show: 500, hide: 100 }
    });
    $(".newToDo").popover({
        html: true,
        title: '',
        content: 'Create new todo',
        placement: 'bottom',
        trigger: 'manual',
        delay: { show: 500, hide: 100 }
    });
    $(".newStory").popover({
        html: true,
        title: '',
        content: 'Create a new story',
        placement: 'right',
        trigger: 'manual',
        delay: { show: 500, hide: 100 }
    });
    $(".edit-btn").popover({
        html: true,
        title: '',
        content: 'Add members',
        placement: 'right',
        trigger: 'manual',
        delay: { show: 500, hide: 100 }
    });
    $("#btn-help").click(function(e) {
        $('.login').popover('toggle');
        e.preventDefault();

        $('.notifications').popover('toggle');
        e.preventDefault();

        $('#new-project').popover('toggle');
        e.preventDefault();

        $('.newToDo:first').popover('toggle');
        e.preventDefault();

        $('.newStory').popover('toggle');
        e.preventDefault();

        $('.edit-btn').popover('toggle');
        e.preventDefault();
    });
}
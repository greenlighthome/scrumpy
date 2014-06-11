/**
 * Created by Matthias on 11/06/14.
 */
Template.projectPage.helpers({
    noMembersInGroup : function() {
        return this.membersCount == 1; // 1 user has to be in the group (project admin)
    }
});
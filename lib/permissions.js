/**
 * Created by Matthias on 01/03/14.
 */
// check that the userId specified owns the documents
ownsDocument = function(userId, doc) {
    return doc && doc.userId === userId;
}

ownsDocumentOrAdmin = function(userId, doc) {
    return (doc && doc.userId === userId) || Roles.userIsInRole(userId, doc.projectId + '-admin');
}

projectAdminOrMember = function(userId, doc) {
    return Roles.userIsInRole(userId, doc.projectId + '-admin') || Roles.userIsInRole(userId, doc.projectId + '-member');
}
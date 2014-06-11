/**
 * Created by Matthias on 19/03/14.
 */

// Local (client-only) collection, Errors collection will only exist in the browser and will make no attempt to
// synchronize with the server.
Errors = new Meteor.Collection(null);

throwError = function(message, details) {
    Errors.insert({message: message, details: details})
}

clearErrors = function() {
    Errors.remove({}); // remove all errors in collection
}
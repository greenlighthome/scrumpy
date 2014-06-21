/**
 * Created by Matthias on 20/06/14.
 */
module.exports = {
    "Sign in to access your projects test" : function (client) {
        client
            .url("http://localhost:3000/projects")
            .waitForElementVisible("body", 1000)
            .assert.containsText("h3", "Sign in to access your projects")
            .end();
    },
    "Create account test" : function (client) {
        client
            .url("http://localhost:3000/projects")
            .waitForElementVisible("body", 1000)
            .click(".dropdown-toggle")
            .click("#signup-link")
            .setValue('#login-username', 'test')
            .setValue('#login-password', 'test1234')
            .setValue('#login-password-again', 'test1234')
            .click("#login-buttons-password")
            .waitForElementVisible("body", 1000)
            .assert.containsText("h3", "Start by creating a new project")
            .end();
    },
    "Login test" : function (client) {
        client
            .url("http://localhost:3000/projects")
            .waitForElementVisible("body", 1000)
            .click(".dropdown-toggle")
            .setValue('#login-username', 'test')
            .setValue('#login-password', 'test1234')
            .click("#login-buttons-password")
            .waitForElementVisible("body", 1000)
            .assert.containsText("h3", "Start by creating a new project")
            .end();
    },
    "Create project test" : function (client) {
        client
            .url("http://localhost:3000/projects")
            .waitForElementVisible("body", 1000)
            .click(".dropdown-toggle")
            .setValue('#login-username', 'test')
            .setValue('#login-password', 'test1234')
            .click("#login-buttons-password")
            .waitForElementVisible("body", 1000)
            .url("http://localhost:3000/create")
            .waitForElementVisible("body", 1000)
            .setValue('input[type=text]', 'TestProject')
            .submitForm('form.main')
            .url("http://localhost:3000/projects")
            .waitForElementVisible("body", 1000)
            .assert.containsText("h3", "TestProject")
            .end();
    },
    "Sign out test" : function (client) {
        client
            .url("http://localhost:3000/projects")
            .waitForElementVisible("body", 1000)
            .click(".dropdown-toggle")
            .setValue('#login-username', 'test')
            .setValue('#login-password', 'test1234')
            .click("#login-buttons-password")
            .waitForElementVisible("body", 1000)
            .click(".dropdown-toggle")
            .click("#login-buttons-logout")
            .assert.containsText("h3", "Sign in to access your projects")
            .end();
    }
};
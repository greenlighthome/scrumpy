/**
 * Created by Matthias on 11/06/14.
 */
module.exports = {
    "Scrumpy" : function (client) {
        client
            .url("http://127.0.0.1:3000")
            .waitForElementVisible("body", 1000)
            .assert.title("Scrumpy")
            .end();
    }
};
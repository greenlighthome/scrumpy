/**
 * Created by Matthias on 19/04/14.
 */

UI.registerHelper('titleShort', function (type) {
    var short = this.title;
    if (short) {
        if (type == "project") {
            if (short.length > 20) {
                short = short.substring(0,20) + '...';
            }
        } else if (type == "sticky") {
            if (short.length > 40) {
                short = short.substring(0,40) + '...';
            }
        }
        else if (type == "story") {
            if (short.length > 9) {
                short = short.substring(0,8) + '...';
            }
        }
    }
    return short;
});
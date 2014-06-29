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
        } else if (type == "sticky" || type == "story") {
            if (short.length > 50) {
                short = short.substring(0,50) + '...';
            }
        }
    }
    return short;
});
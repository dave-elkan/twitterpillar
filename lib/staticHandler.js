var filed = require("filed");

function static (req, res) {

    var file = __dirname + "/../" + req.url;

    filed(file).pipe(res);
}

module.exports = static;
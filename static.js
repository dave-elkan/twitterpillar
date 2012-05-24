var filed = require("filed"),
    path = require("path");

function static (req, res) {

    var file = __dirname + req.url;

    filed(file).pipe(res);
}

module.exports = static;
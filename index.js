
var path = require('path');

var dirpaths = require(path.join(__dirname + '/lib/paths'));

for (key in dirpaths) {
	if (dirpaths.hasOwnProperty(key)) exports[key] = dirpaths[key];
};

exports.readFiles = require(path.join(__dirname + '/lib/readfiles'));


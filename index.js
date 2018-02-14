var dirpaths = require('./lib/paths');

for(var x in dirpaths)exports[x] = dirpaths[x]

exports.readFiles = require('./lib/readfiles');
exports.readFilesStream = require('./lib/readfilesstream');

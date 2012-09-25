
var path = require('path');

exports.readFiles = require(path.join(__dirname + '/lib/readfiles'));

exports.filePaths = require(path.join(__dirname + '/lib/filepaths'));

/**
 * passes all subdirs (recursive) to callback fn
 *
 * @param {string} dir directory in which to recurse files or subdirs
 * @param {string} type type of dir entry to recurse ('file' or 'dir', defaults to 'file')
 * @param {function(error, <Array.<string>)} callback fn to call when done
 */
exports.subDirs = function subDirs(dir, callback) {
	exports.filePaths(dir, 'dir', callback);
};






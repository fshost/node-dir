
var fs = require('fs'),
    path = require('path');

/**
 * passes all files or subdirs (recursive) to callback fn
 *
 * @param {string} dir directory in which to recurse files or subdirs
 * @param {string} type type of dir entry to recurse ('file' or 'dir', defaults to 'file')
 * @param {function(error, <Array.<string>)} callback fn to call when done
 * @example
 * dir.filePaths(tdir, function(err, files) {
 *		if (err) throw err;
 *		console.log('files:', files);
 *	});
 */
module.exports = function filePaths(dir, type, callback) {

	var pending,
		results = [];
	
	var getStatHandler = function(statPath) {
	
		return function(err, stat) {
				
			if (stat && stat.isDirectory()) {
				if (type === 'dir') results.push(statPath);
				filePaths(statPath, type, function(err, res) {
					results = results.concat(res);
					if (!--pending) callback(null, results);
				});
			}
			else {
				if (type === 'file') results.push(statPath);
				if (!--pending) callback(null, results);
			}
			
		};
		
	};
	
	if (typeof type !== 'string') {
		callback = type;
		type = 'file';
	}
	fs.readdir(dir, function(err, list) {
	
		if (err) return callback(err);
		pending = list.length;
		if (!pending) return callback(null, results);
		for (var i = 0, file; file = list[i]; i++) {
			file = path.join(dir,file);
			fs.stat(file, getStatHandler(file));
		}
		
	});
	
};
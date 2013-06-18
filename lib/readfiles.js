var fs = require('fs'),
    path = require('path');

/**
 * merge two objects
 * @param target object to merge
 * @param source object to merge
 * @param {Boolean} [modify] whether to modify the target
 * @returns {Object} object (new unless modify is true) consisting of the merged objects
 */

function extend(target, source, modify) {
    var result = target ? modify ? target : extend({}, target, true) : {};
    if (!source) return result;
    for (var key in source) {
        if (source.hasOwnProperty(key) && source[key] !== undefined) {
            result[key] = source[key];
        }
    }
    return result;
}

/**
 * read files and call a function with the contents of each file
 * @param  {String} dir path of dir containing the files to be read
 * @param  {String} encoding file encoding (default is 'utf8')
 * @param  {Object} options options hash for encoding, recursive, and match/exclude
 * @param  {Function(error, string)} callback  callback for each files content
 * @param  {Function(error)}   complete  fn to call when finished
 */

function readFiles(dir, options, callback, complete) {
    if (typeof options === 'function') {
        complete = callback;
        callback = options;
        options = {};
    }
    options = extend({
        recursive: true,
        encoding: 'utf8'
    }, options);
    var files = [];

    var done = function(err) {
        if (typeof complete === 'function') {
            if (err) return complete(err);
            complete(null, files);
        }
    };

    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;

        (function next() {
            var filename = list[i++];
            if (!filename) return done(null, files);
            var file = path.join(dir, filename);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory() && options.recursive) {
                    readFiles(file, options, callback, function(err, sfiles) {
                        files = files.concat(sfiles);
                        next();
                    });
                } else {
                    if (options.match && !options.match.test(filename)) return next();
                    if (options.exclude && options.exclude.test(filename)) return next();
                    if (options.shortName) files.push(filename);
                    else files.push(file);
                    fs.readFile(file, options.encoding, function(err, data) {
                        if (err) return done(err);
                        if (callback.length > 3)
                            if (options.shortName) callback(null, data, filename, next);
                            else callback(null, data, file, next);
                        else callback(null, data, next);
                    });
                }
            });
        })();

    });
}
module.exports = readFiles;
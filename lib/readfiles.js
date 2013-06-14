
var fs = require('fs'),
    path = require('path');

/**
 * read files and call a function with the contents of each file
 * @param  {string}     dir         path of dir containing the files to be read
 * @param  {string}     encoding    file encoding (default is 'utf8')
 * @param  {boolean}    recursive   whether to recurse subdirs
 * @param  {Function(error, string)} callback  callback for each files content
 * @param  {Function(error)}   complete  fn to call when finished
 */
function readFiles(dir, encoding, recursive, callback, complete) {

    var files = [];

    var done = function (err) {
        if (typeof complete === 'function') {
            if (err) return complete(err);
            complete(null, files);
        }
    };

    // encoding is optional and defaults to 'utf8'
    if (typeof encoding !== 'string') {
        complete = callback;
        callback = recursive;
        recursive = encoding;
        encoding = 'utf8';
    }
    // recursive is optional and defaults to true
    if (typeof recursive !== 'boolean') {
        complete = callback;
        callback = recursive;
        recursive = true;
    }
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {

            var file = list[i++];
            if (!file) return done(null, files);
            file = path.join(dir,file);

            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    readFiles(file, encoding, recursive, callback, function(err, sfiles) {
                        files = files.concat(sfiles);
                        next();
                    });
                }
                else {
                    files.push(file);
                    fs.readFile(file, encoding, function(err, data) {
                        if (err) return done(err);
                        if (callback.length > 3) callback(null, data, file, next);
                        else callback(null, data, next);
                    });
                }
            });

        })();
    });
}
module.exports = readFiles;


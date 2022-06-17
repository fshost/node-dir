"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFilesStream = void 0;
var fs = require('fs'), mm = require('minimatch');
var path = require("path");
function extend(target, source, modify) {
    var result = target ? modify ? target : extend({}, target, true) : {};
    if (!source)
        return result;
    for (var key in source) {
        if (source.hasOwnProperty(key) && source[key] !== undefined) {
            result[key] = source[key];
        }
    }
    return result;
}
function matches(str, match) {
    if (Array.isArray(match)) {
        var l = match.length;
        for (var s = 0; s < l; s++) {
            if (mm(str, match[s])) {
                return true;
            }
        }
        return false;
    }
    return match.test(str);
}
function readFilesStream(dir, options, callback, complete) {
    if (typeof options === 'function') {
        complete = callback;
        callback = options;
        options = {};
    }
    if (typeof options === 'string')
        options = {
            encoding: options
        };
    options = extend({
        recursive: true,
        encoding: 'utf8',
        doneOnErr: true
    }, options);
    var files = [];
    var done = function (err, _result) {
        if (typeof complete === 'function') {
            if (err)
                return complete(err);
            complete(null, files);
        }
    };
    fs.readdir(dir, function (err, list) {
        if (err) {
            if (options.doneOnErr === true) {
                if (err.code === 'EACCES')
                    return done();
                return done(err);
            }
        }
        var i = 0;
        if (options.reverse === true ||
            (typeof options.sort == 'string' &&
                (/reverse|desc/i).test(options.sort))) {
            list = list.reverse();
        }
        else if (options.sort !== false)
            list = list.sort();
        (function next() {
            var filename = list[i++];
            if (!filename)
                return done(null, files);
            var file = path.join(dir, filename);
            fs.stat(file, function (err, stat) {
                if (err && options.doneOnErr === true)
                    return done(err);
                if (stat && stat.isDirectory()) {
                    if (options.recursive) {
                        if (options.matchDir && !matches(filename, options.matchDir))
                            return next();
                        if (options.excludeDir && matches(filename, options.excludeDir))
                            return next();
                        readFilesStream(file, options, callback, function (err, sfiles) {
                            if (err && options.doneOnErr === true)
                                return done(err);
                            files = files.concat(sfiles);
                            next();
                        });
                    }
                    else
                        next();
                }
                else if (stat && stat.isFile()) {
                    if (options.match && !matches(filename, options.match))
                        return next();
                    if (options.exclude && matches(filename, options.exclude))
                        return next();
                    if (options.filter && !options.filter(filename))
                        return next();
                    if (options.shortName)
                        files.push(filename);
                    else
                        files.push(file);
                    var stream = fs.createReadStream(file);
                    if (options.encoding !== null) {
                        stream.setEncoding(options.encoding);
                    }
                    stream.on('error', function (err) {
                        if (options.doneOnErr === true)
                            return done(err);
                        next();
                    });
                    if (callback.length > 3)
                        if (options.shortName)
                            callback(null, stream, filename, next);
                        else
                            callback(null, stream, file, next);
                    else
                        callback(null, stream, next);
                }
                else {
                    next();
                }
            });
        })();
    });
}
exports.readFilesStream = readFilesStream;

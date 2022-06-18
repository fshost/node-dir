"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.files = exports.promiseFiles = void 0;
var fs = require("fs");
var path = require("path");
function promiseFiles(dir, type, options, statOptions) {
    switch (typeof type) {
        case 'object':
            options = type;
            type = 'file';
            break;
        default: type = type || 'file';
    }
    var processor = function (res, rej) {
        var cb = function (err, data) {
            if (err)
                return rej(err);
            res(data);
        };
        exports.files(dir, type, cb, options, statOptions);
    };
    return new Promise(processor);
}
exports.promiseFiles = promiseFiles;
function files(dir, type, callback, options, statOptions) {
    var ofType = typeof type;
    if (ofType == 'object') {
        options = options || type;
        type = 'file';
        callback = function () { };
    }
    else if (ofType !== 'string') {
        callback = type;
        type = 'file';
    }
    options = options || {};
    var pending;
    var results = {
        files: [],
        dirs: []
    };
    var done = function (_list) {
        if (type === 'combine') {
            results = results.files.concat(results.dirs);
        }
        else if (!type || options.ignoreType || ['all', 'combine'].indexOf(type) >= 0) {
            results = results;
        }
        else {
            results = results[type + 's'];
        }
        if (options.sync)
            return;
        callback(null, results);
    };
    var getStatHandler = function (statPath, name, statHanOptions) {
        return function (err, stat) {
            if (err) {
                if (!statHanOptions.lstatCalled) {
                    var newStatHanOptions = assign(statHanOptions, { lstatCalled: true });
                    if (options.sync) {
                        var lstat = fs.lstatSync(statPath);
                        return getStatHandler(statPath, name, newStatHanOptions)(null, lstat);
                    }
                    else {
                        return fs.lstat(statPath, getStatHandler(statPath, name, newStatHanOptions));
                    }
                }
                return callback(err);
            }
            var isDir = stat && stat.isDirectory() && stat.mode !== 17115;
            var pushVal = statHanOptions.valuetizer(stat, name, statPath, isDir);
            if (pushVal == null) {
                if (!--pending) {
                    done();
                }
                return;
            }
            if (isDir) {
                if (type !== 'file') {
                    results.dirs.push(pushVal);
                }
                if (options.recursive == null || options.recursive) {
                    var subloop = function (err, res) {
                        if (err) {
                            return callback(err);
                        }
                        if (type === 'combine') {
                            results.files = results.files.concat(res);
                        }
                        else if (type === 'all') {
                            if (res.files) {
                                results.files = results.files.concat(res.files);
                            }
                            results.dirs = results.dirs.concat(res.dirs);
                        }
                        else if (type === 'file') {
                            if (res.files) {
                                results.files = results.files.concat(res.files);
                            }
                        }
                        else {
                            results.dirs = results.dirs.concat(res.dirs);
                        }
                        if (!--pending) {
                            done();
                        }
                    };
                    var newOptions = assign({}, options);
                    newOptions.basePath = options.basePath || dir;
                    newOptions.ignoreType = true;
                    var moreResults = files(statPath, type, subloop, newOptions);
                    if (options.sync) {
                        subloop(null, moreResults);
                    }
                }
                else if (!--pending) {
                    done();
                }
            }
            else {
                var excludeHidden = options.excludeHidden && name.split(path.sep).pop().search(/^\./) == 0;
                if (type !== 'dir' && !excludeHidden) {
                    results.files.push(pushVal);
                }
                if (!--pending) {
                    done();
                }
            }
        };
    };
    var onDirRead = function (err, list, statOptions) {
        if (err)
            return callback(err);
        pending = list.length;
        if (!pending) {
            done(list);
            return list;
        }
        var statHanOptions = {};
        if (options.valuetizer) {
            statHanOptions.valuetizer = options.valuetizer;
        }
        else {
            statHanOptions.valuetizer = getValuetizerByOptions(options, dir);
        }
        for (var file, i = 0, l = list.length; i < l; i++) {
            var fname = list[i].toString();
            file = path.join(dir, fname);
            if (options.sync) {
                var res = fs.statSync(file, statOptions);
                getStatHandler(file, list[i], statHanOptions)(null, res);
            }
            else {
                fs.stat(file, getStatHandler(file, list[i], statHanOptions));
            }
        }
        return results;
    };
    var onStat = function (err, stat, statOptions) {
        if (err)
            return callback(err);
        if (stat && stat.mode === 17115)
            return done();
        if (options.sync) {
            var list = fs.readdirSync(dir);
            return onDirRead(null, list, statOptions);
        }
        else {
            fs.readdir(dir, function (err, files) { return onDirRead(err, files, statOptions); });
        }
    };
    if (options.sync) {
        var stat = fs.statSync(dir);
        return onStat(null, stat, statOptions);
    }
    else {
        fs.stat(dir, onStat);
    }
}
exports.files = files;
;
exports.paths = function paths(dir, combine, callback) {
    if (typeof combine === 'function') {
        callback = combine;
        combine = false;
    }
    files(dir, 'all', function (err, results) {
        if (err)
            return callback(err);
        if (combine) {
            callback(null, results.files.concat(results.dirs));
        }
        else {
            callback(null, results);
        }
    });
};
exports.subdirs = function subdirs(dir, callback, type, options) {
    options = options || {};
    var iCallback = function (err, subdirs) {
        if (err)
            return callback(err);
        if (type == 'combine') {
            subdirs = subdirs.files.concat(subdirs.dirs);
        }
        if (options.sync)
            return subdirs;
        callback(null, subdirs);
    };
    var res = exports.files(dir, 'dir', iCallback, options);
    if (options && options.sync) {
        return iCallback(null, res);
    }
};
function assign(c0, c1) {
    for (var x in c1)
        c0[x] = c1[x];
    return c0;
}
function getValuetizerByOptions(options, dir) {
    if (options.shortName) {
        if (options.shortName == 'relative') {
            var dirBase = (options.basePath || dir);
            var startPos = dirBase.length;
            if (dirBase.substring(dirBase.length - path.sep.length, dirBase.length) != path.sep) {
                startPos = startPos + path.sep.length;
            }
            return function (stat, shortName, longPath, isDir) {
                return longPath.substring(startPos, longPath.length);
            };
        }
        else {
            return function (stat, shortName, longPath) {
                return shortName;
            };
        }
    }
    return function (stat, shortName, longPath) {
        return longPath;
    };
}

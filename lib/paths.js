var fs = require('fs'),
    path = require('path');

exports.promiseFiles = function promiseFiles(dir, type, options){
  switch(typeof type){
    case 'object':
      options = type
      type = 'file'
      break;

    default:type = type || 'file'
  }

  var processor = function(res,rej){
    var cb = function(err,data){
      if(err)return rej(err)
      res(data)
    }
    exports.files(dir,type,cb,options)
  }
  return new Promise(processor)
}

/**
 * find all files or subdirs (recursive) and pass to callback fn
 *
 * @param {string} dir directory in which to recurse files or subdirs
 * @param {string} type type of dir entry to recurse ('file', 'dir', or 'all', defaults to 'file')
 * @param {function(error, <Array.<string>)} callback fn to call when done
 * @example
 * dir.files(__dirname, function(err, files) {
 *      if (err) throw err;
 *      console.log('files:', files);
 *  });
 */
exports.files = function files(dir, type, callback, options) {
  var ofType = typeof type
  if(ofType == 'object'){
    options = options || type
    type = 'file'
    callback = function(){}
  }else if (ofType !== 'string') {
    //ignoreType = callback;
    callback = type;
    type = 'file';
  }
  
  options = options || {}

  var pending,
      results = {
          files: [],
          dirs: []
      };

  var done = function() {
    if(type==='combine'){
      results = results.files.concat(results.dirs)
    } else if (!type || options.ignoreType || ['all','combine'].indexOf(type)>=0) {
        results = results
    } else {
      results = results[type + 's']
    }

    if(options.sync)return;


    callback(null, results);
  };

  /** 
    @statPath - fullPath
    @name - fileName
    @statHanOptions - {
      valuetizer:function(stat, shortName, longPath){}, - function the handles value assignment
      lstatCalled:false - used internally
    }
  */
  var getStatHandler = function(statPath, name, statHanOptions) {
    return function(err, stat) {
      if (err) {
        if (!statHanOptions.lstatCalled) {
          var newStatHanOptions = assign(statHanOptions, {lstatCalled:true})
          if(options.sync){
            var lstat = fs.lstatSync(statPath);
            return getStatHandler(statPath, name, newStatHanOptions)(null, lstat)
          }else{
            return fs.lstat(statPath, getStatHandler(statPath, name, newStatHanOptions));
          }
        }
        return callback(err);
      }

      var isDir = stat && stat.isDirectory() && stat.mode !== 17115
      var pushVal = statHanOptions.valuetizer(stat, name, statPath, isDir)//options.shortName ? name : statPath

      if (isDir) {
        if (type !== 'file') {
          results.dirs.push(pushVal);
        }

        if (options.recursive==null || options.recursive) {
          var subloop = function(err, res) {
            if (err){
                return callback(err)
            }
            
            if(type === 'combine'){
              results.files = results.files.concat(res);
            }else if (type === 'all') {
              results.files = results.files.concat(res.files);
              results.dirs = results.dirs.concat(res.dirs);
            } else if (type === 'file') {
                results.files = results.files.concat(res.files);
            } else {
                results.dirs = results.dirs.concat(res.dirs);
            }

            if (!--pending){
              done();
            }
          }

          var newOptions = assign({}, options)
          newOptions.basePath = options.basePath || dir
          newOptions.ignoreType = true
          var moreResults = exports.files(statPath, type, subloop, newOptions);

          if(options.sync){
            subloop(null, moreResults)
          }
        }else if (!--pending){
          done()
        }
      } else {
        var excludeHidden = options.excludeHidden && name.split(path.sep).pop().search(/^\./)==0

        if (type!=='dir' && !excludeHidden) {
          results.files.push(pushVal);
        }
        // should be the last statement in statHandler
        if (!--pending){
          done()
        }
      }
    }
  }


  //var bufdir = Buffer.from(dir);

  const onDirRead = function(err, list) {
    if (err) return callback(err);
    
    pending = list.length;
    if (!pending) return done();

    var statHanOptions = {}
    if(options.shortName){
      if(options.shortName=='relative'){
        var dirBase = (options.basePath||dir)
        var startPos = dirBase.length
        if(dirBase.substring(dirBase.length-path.sep.length, dirBase.length)!=path.sep){
          startPos = startPos + path.sep.length
        }

        statHanOptions.valuetizer = function(stat, shortName, longPath, isDir){
          return longPath.substring(startPos, longPath.length)
        }
      }else{
        statHanOptions.valuetizer = function(stat, shortName, longPath){
          return shortName
        }
      }
    }else{
      statHanOptions.valuetizer = function(stat, shortName, longPath){
        return longPath
      }
    }
    
    for (var file, i = 0, l = list.length; i < l; i++) {
      var fname = list[i].toString();
      file = path.join(dir, fname);
      //var buffile = Buffer.concat([bufdir, Buffer.from(path.sep), list[i]]);

      if(options.sync){
        var res = fs.statSync(file);
        getStatHandler(file, list[i], statHanOptions)(null, res)
      }else{
        fs.stat(file, getStatHandler(file, list[i], statHanOptions));
      }
    }

    return results
  }

  const onStat = function(err, stat) {
    if (err) return callback(err);
    if (stat && stat.mode === 17115) return done();

    if(options.sync){
      const list = fs.readdirSync(dir)
      return onDirRead(null, list)
    }else{
      fs.readdir(dir, onDirRead)
    }
  }

  if(options.sync){
    const stat = fs.statSync(dir);
    return onStat(null, stat)
  }else{
    fs.stat(dir, onStat);
  }
};


/**
 * find all files and subdirs in  a directory (recursive) and pass them to callback fn
 *
 * @param {string} dir directory in which to recurse files or subdirs
 * @param {boolean} combine whether to combine both subdirs and filepaths into one array (default false)
 * @param {function(error, Object.<<Array.<string>, Array.<string>>)} callback fn to call when done
 * @example
 * dir.paths(__dirname, function (err, paths) {
 *     if (err) throw err;
 *     console.log('files:', paths.files);
 *     console.log('subdirs:', paths.dirs);
 * });
 * dir.paths(__dirname, true, function (err, paths) {
 *      if (err) throw err;
 *      console.log('paths:', paths);
 * });
 */
exports.paths = function paths(dir, combine, callback) {

    var type;

    if (typeof combine === 'function') {
        callback = combine;
        combine = false;
    }

    exports.files(dir, 'all', function(err, results) {
        if (err) return callback(err);
        if (combine) {
            callback(null, results.files.concat(results.dirs));
        } else {
            callback(null, results);
        }
    });
};


/**
 * find all subdirs (recursive) of a directory and pass them to callback fn
 *
 * @param {string} dir directory in which to find subdirs
 * @param {string} type type of dir entry to recurse ('file' or 'dir', defaults to 'file')
 * @param {function(error, <Array.<string>)} callback fn to call when done
 * @example
 * dir.subdirs(__dirname, function (err, paths) {
 *      if (err) throw err;
 *      console.log('files:', paths.files);
 *      console.log('subdirs:', paths.dirs);
 * });
 */
exports.subdirs = function subdirs(dir, callback, type, options) {
  options = options || {}

  const iCallback = function(err, subdirs) {
    if (err) return callback(err);

    if(type=='combine'){
      subdirs = subdirs.files.concat(subdirs.dirs)
    }
    
    if(options.sync)return subdirs

    callback(null, subdirs);
  }

  const res = exports.files(dir, 'dir', iCallback, options)

  if(options && options.sync){
    return iCallback(null,res)
  }
}

function assign(c0, c1){
  for(var x in c1)c0[x] = c1[x]
  return c0
}
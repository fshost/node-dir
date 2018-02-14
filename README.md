[![hire me](https://ackerapple.github.io/resume/assets/images/hire-me-badge.svg)](https://ackerapple.github.io/resume/)
[![npm downloads](https://img.shields.io/npm/dm/path-reader.svg)](https://npmjs.org/path-reader)
[![Dependency Status](https://david-dm.org/ackerapple/path-reader.svg)](https://david-dm.org/ackerapple/path-reader)
[![Build Status](https://secure.travis-ci.org/AckerApple/path-reader.svg)](http://travis-ci.org/AckerApple/path-reader)
[![Build status](https://ci.appveyor.com/api/projects/status/6sa5pfcsrix5s8va?svg=true)](https://ci.appveyor.com/project/AckerApple/path-reader)
[![NPM version](https://img.shields.io/npm/v/path-reader.svg?style=flat-square)](https://www.npmjs.com/package/path-reader)

# path-reader
A lightweight Node.js module with methods for some common directory and file operations, including asynchronous, non-blocking methods for recursively getting an array of files, subdirectories, or both, and methods for recursively, sequentially reading and processing the contents of files in a directory and its subdirectories, with several options available for added flexibility if needed.

### Table of Contents

- [installation](#installation)
- [usage](#usage)
  - [methods](#methods)
  - [readFiles](#readfiles)
  - [options](#options)
  - [readFilesStream](#readfilesstream)
    - [readFilesStream examples](#readfilesstream-examples)
  - [readFiles valuetizer](#readfiles-valuetizer)
  - [files async](#files-async)
  - [files sync](#files-sync)
  - [promiseFiles](#promisefiles)
  - [subdirs](#subdirs)
  - [paths](#paths)
- [API Docs](#api-docs)
  - [files](#files-api)
  - [promiseFiles](#promisefiles-api)
- [History](#history)
- [License](#license)

#### installation

```
npm install path-reader
```

### usage

#### methods
For the sake of brevity, assume that the following line of code precedes all of the examples.

```javascript
var dir = require('path-reader');
```

#### readFiles
A variation on the method readFilesStream. See usage for [readFilesStream](#readFilesStream)
```javascript
readFiles( dir, [options], fileCallback, [finishedCallback] )
```

#### Options
- **encoding** - file encoding (defaults to 'utf8')
- **exclude** - a regex pattern or array to specify filenames to ignore
- **excludeDir** - a regex pattern or array to specify directories to ignore
- **match** - a regex pattern or array to specify filenames to operate on
- **matchDir** - a regex pattern or array to specify directories to recurse 
- **recursive** - whether to recurse subdirectories when reading files (defaults to true)
- **reverse** - sort files in each directory in descending order
- **shortName** - whether to aggregate only the base filename rather than the full filepath
- **sort** - sort files in each directory in ascending order (defaults to true)
  - A reverse sort can also be achieved by setting the sort option to 'reverse', 'desc', or 'descending' string value.
- **doneOnErr** - control if done function called on error (defaults to true)
- **sync** : boolean = false - results are returned inline and no callbacks are used
- **shortName** : boolean = false||'relative' - instead of fullpath file names, just get the names or relative item names
- **recursive** : boolean = true - traverse through all children of given path
- **excludeHidden** : boolean - hidden files will be ignored (files starting with a dot are ignored)
- **valuetizer** : (stat, fileName, filePath) - A function of (stat, fileName, fileFullPath) . When null returned, item is skipped in end results

#### readFilesStream
Sequentially read the content of each file in a directory, passing the contents to a callback, optionally calling a finished callback when complete.  The options and finishedCallback arguments are not required.

```javascript
readFilesStream( dir, [options], streamCallback, [finishedCallback] )
```

#### readFiles valuetizer
An example of building an array of only items with an mtime
```javascript
var options = {
  valuetizer:function(stat, shortName, longPath){
    return stat.mtime ? stat : null
  }
}

require('path-reader').promiseFiles(tdir, 'file', options)
.then(function(results){
  console.log(results)//an array of file stat if the file has a mtime definition
})
```

#### readFilesStream examples

Display contents of files in this script's directory
```javascript
dir.readFiles(__dirname,
    function(err, content, next) {
        if (err) throw err;
        console.log('content:', content);
        next();
    },
    function(err, files){
        if (err) throw err;
        console.log('finished reading files:', files);
    }
);
```

Display contents of huge files in this script's directory
```javascript
dir.readFilesStream(__dirname,
    function(err, stream, next) {
        if (err) throw err;
        var content = '';
        stream.on('data',function(buffer) {
            content += buffer.toString();
        });
        stream.on('end',function() {
            console.log('content:', content);
            next();
        });
    },
    function(err, files){
        if (err) throw err;
        console.log('finished reading files:', files);
    }
);
```

Match only filenames with a .txt extension and that don't start with a `.´
```javascript
dir.readFiles(__dirname, {
    match: /.txt$/,
    exclude: /^\./
    }, function(err, content, next) {
        if (err) throw err;
        console.log('content:', content);
        next();
    },
    function(err, files){
        if (err) throw err;
        console.log('finished reading files:',files);
    }
);
```

Exclude an array of subdirectory names
```javascript
dir.readFiles(__dirname, {
    excludeDir: ['node_modules', 'test']
    }, function(err, content, next) {
        if (err) throw err;
        console.log('content:', content);
        next();
    },
    function(err, files){
        if (err) throw err;
        console.log('finished reading files:',files);
    }
);
```

The callback for each file can optionally have a filename argument as its 3rd parameter and the finishedCallback argument is optional, e.g.
```javascript
dir.readFiles(__dirname, function(err, content, filename, next) {
    console.log('processing content of file', filename);
    next();
});
```

        
#### files async
Asynchronously iterate the files of a directory and its subdirectories and pass an array of file paths to a callback.
    
```javascript
dir.files(__dirname, function(err, files) {
    if (err) throw err;
    console.log(files);
});
```
        
#### files sync
Synchronously iterate the files of a directory and its subdirectories and pass an array of file paths to a callback.

In this example, a console log of items by relative path will be made
```javascript
var files = dir.files(__dirname, {sync:true, shortName:'relative', excludeHidden:true});
console.log(files);
```

#### promiseFiles
Asynchronously iterate the files of a directory and its subdirectories and pass an array of file paths to a callback.

```javascript
promiseFiles(path, readType||options, options)
```

promiseFiles example
```javascript
dir.promiseFiles(__dirname)
.then((files)=>{
    console.log(files);
})
.catch(e=>console.error(e))
```

Note that for the files and subdirs the object returned is an array, and thus all of the standard array methods are available for use in your callback for operations like filters or sorting. Some quick examples:

```javascript
dir.files(__dirname, function(err, files) {
    if (err) throw err;
    
    // sort ascending
    files.sort();
    
    // sort descending
    files.reverse();
    
    // include only certain filenames
    files = files.filter(function (file) {
       return ['allowed', 'file', 'names'].indexOf(file) > -1;
    });
    
    // exclude some filenames
    files = files.filter(function (file) {
        return ['exclude', 'these', 'files'].indexOf(file) === -1;
    });
});
```

Also note that if you need to work with the contents of the files asynchronously, please use the readFiles method.  The files and subdirs methods are for getting a list of the files or subdirs in a directory as an array.
        
#### subdirs
Asynchronously iterate the subdirectories of a directory and its subdirectories and pass an array of directory paths to a callback.

```javascript
subdirs( dir, callback )
```

Example
```javascript
dir.subdirs(__dirname, function(err, subdirs) {
    if (err) throw err;
    console.log(subdirs);
});
```

#### paths
Asynchronously iterate the subdirectories of a directory and its subdirectories and pass an array of both file and directory paths to a callback.

```javascript
paths(dir, [combine], callback )
```

Example: Separated into two distinct arrays (paths.files and paths.dirs)
```javascript
dir.paths(__dirname, function(err, paths) {
    if (err) throw err;
    console.log('files:\n',paths.files);
    console.log('subdirs:\n', paths.dirs);
});
```


Combined in a single array (convenience method for concatenation of the above)

```javascript
dir.paths(__dirname, true, function(err, paths) {
    if (err) throw err;
    console.log('paths:\n',paths);
});
```

## API Docs

### files API

```javascript
files(dir, type, callback, options)
```

- **dir** - directory path to read
- **type**='file'
  - 'file' returns only file listings
  - 'dir' returns only directory listings
  - 'all' returns {dirs:[], files:[]}
  - 'combine' returns []
- **callback** - 
- **options**
  - **sync**=false - results are returned inline and no callbacks are used
  - **shortName**=false||'relative' - instead of fullpath file names, just get the names or relative item names
  - **recursive**=true - traverse through all children of given path
  - **excludeHidden** - hidden files will be ignored (files starting with a dot are ignored)
  - **valuetizer** - A function of (stat, fileShortName, fileFullPath) . When null returned, item is skipped in end results

### promiseFiles API

```javascript
promiseFiles(dir, type||options, options)
```

- **dir** - directory path to read
- **type**='file'
    - 'file' returns only file listings
    - 'dir' returns only directory listings
    - 'all' returns {dirs:[], files:[]}
    - 'combine' returns []
- **options**
    - **sync**=false - DO NOT USE for promiseFiles, will cause unexpected behavior
    - **shortName**=false||'relative' - instead of fullpath file names, just get the names or relative item names
    - **recursive**=true - traverse through all children of given path
    - **valuetizer** - A function of (stat, fileShortName, fileFullPath) . When null returned, item is skipped in end results

## History
path-reader is a fork of node-dir. The original maintainer of node-dir, @fshost, has not updated nor been heard from in some time. Use path-reader, it is far superior to node-dir.

## License
MIT licensed (See LICENSE.txt)

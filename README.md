[![Build Status](https://secure.travis-ci.org/fshost/node-dir.png)](http://travis-ci.org/fshost/node-dir)

# node-dir
A small node.js module to provide some convenience methods for asynchronous, non-blocking, recursive directory operations like being able to get an array of all files, subdirectories, or both (with the option to either combine or separate the results), and for sequentially reading and processing the contents all files in a directory recursively, optionally invoking a callback after all files have been processed.

#### methods
For the sake of brevity, assume that the following line of code precedes all of the examples.

```javascript
var dir = require('node-dir');
```

#### readFiles( dir, [options], fileCallback, [finishedCallback] )
Sequentially read the content of each file in a directory, passing the contents to a callback, optionally calling a finished callback when complete.  The options and finishedCallback arguments are not required.

Valid options are:
- encoding: file encoding (defaults to 'utf8')
- match: a regex pattern to specify filenames to operate on
- exclude: a regex pattern to specify filenames to ignore
- matchDir: a regex pattern to specify directories to recurse 
- excludeDir: a regex pattern to specify directories to ignore
- shortName: whether to aggregate only the base filename rather than the full filepath
- recursive: whether to recurse subdirectories when reading files.  The default is true.
- sort: sort files in each directory in ascending order (defaults to true).
- reverse: sort files in each directory in descending order.

note that a reverse sort can also be achieved by setting the sort option to 'reverse', 'desc', or 'descending' string value.


```javascript
dir.readFiles(__dirname,
    function(err, content, next) {
        if (err) throw err;
        console.log('content:', content);
        next();
    },
    function(err, files){
        if (err) throw err;
        console.log('finished reading files:',files);
    });

// match only filenames with a .txt extension and that don't start with a `.´
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
    });

// the callback for each file can optionally have a filename argument as its 3rd parameter
// and the finishedCallback argument is optional, e.g.
dir.readFiles(__dirname, function(err, content, filename, next) {
        console.log('processing content of file', filename);
        next();
    });
```

        
#### files( dir, callback )
Asynchronously iterate the files of a directory and its subdirectories and pass an array of file paths to a callback.
    
```javascript
dir.files(__dirname, function(err, files) {
    if (err) throw err;
    console.log(files);
});
```

        
#### subdirs( dir, callback )
Asynchronously iterate the subdirectories of a directory and its subdirectories and pass an array of directory paths to a callback.

```javascript
dir.subdirs(__dirname, function(err, subdirs) {
    if (err) throw err;
    console.log(subdirs);
});
```


#### paths(dir, [combine], callback )
Asynchronously iterate the subdirectories of a directory and its subdirectories and pass an array of both file and directory paths to a callback.

Separated into two distinct arrays (paths.files and paths.dirs)

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


## License
MIT licensed (See LICENSE.txt)

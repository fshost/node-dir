# node-dir
A small node.js module to provide some convenience methods for asynchronous, non-blocking, recursive directory operations like being able to get an array of all files, subdirectories, or both (with the option to either combine or separate the results), and for sequentially reading and processing the contents all files in a directory recursively, optionally firing a callback when finished.

#### methods
For the sake of brevity, assume that the following line of code precedes all of the examples.

```javascript
var dir = require('node-dir');
```

#### readFiles( dir, fileCallback, [finishedCallback] )
Sequentially read the content of each file in a directory, passing the contents to a callback, optionally calling a finished callback when complete.

```javascript
dir.readFiles(__dirname, 
    function(err, content, next) {
        if (err) throw err;
        console.log('content for', filepath + '\n' + content);
        // continue to next file:
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

#### contributors
- [Nathan Cartwright](https://github.com/fshost)
- [Robatron](https://github.com/robatron)

## License
MIT licensed (See LICENSE.txt)

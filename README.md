# node-dir
small node.js module to provide some convenience methods for asynchronous, non-blocking recursive directory operations like being able to get an array of all files, subdirectories, or both (with the option to either combine or separate the results), and for sequentially reading and processing the contents all files in a directory recursively, optionally firing a callback when finished.

####methods
for the sake of brevity, assume that the following line of code precedes all of the examples

    var dir = require('node-dir');


####readFiles( dir, fileCallback, finishedCallback )
sequentially read the content of each file in a directory, passing the contents to a callback, optionally calling a finished callback when complete.

    dir.readFiles(__dirname, 
        function(err, content, next) {
            if (err) throw err;
            console.log(content);
            // required to continue to next file:
            next();
    	},
    	function(err, files){
        	if (err) throw err;
        	console.log('finished reading files:',files);
        });

		
####files( dir, callback )
asynchronously iterate the files of a directory and its subdirectories and pass an array of file paths to a callback
	
	dir.files(__dirname, function(err, files) {
	    if (err) throw err;
	    console.log(files);
	});

		
####subdirs( dir, callback )
asynchronously iterate the subdirectories of a directory and its subdirectories and pass an array of directory paths to a callback

	dir.subdirs(__dirname, function(err, subdirs) {
		if (err) throw err;
		console.log(subdirs);
	});
		

####paths(dir, [combine], callback )
asynchronously iterate the subdirectories of a directory and its subdirectories and pass an array of both file and directory paths to a callback

separated into two distinct arrays (paths.files and paths.dirs)

		dir.paths(__dirname, function(err, paths) {
			if (err) throw err;
			console.log('files:\n',paths.files);
			console.log('subdirs:\n', paths.dirs);
		});
		
combined in a single array (convenience method for concatenation of the above)

		dir.paths(__dirname, true, function(err, paths) {
			if (err) throw err;
			console.log('paths:\n',paths);
		});
		
## License
MIT licensed (SEE LICENSE.txt)

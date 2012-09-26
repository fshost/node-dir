# node-dir
asynchronous recursive file and directory operations for Node.js

## methods

### readFiles ( dir, fileCallback, finishedCallback )
read all files in directory and its subdirectories and pass the file contents to a callback

#### example
	    var dir = require('node-dir');
	    dir.readFiles(__dirname, 
	        function(err, content, next) {
	            if (err) throw err;
	            console.log(content);
	            next();	
	    	},
	    	function(err, files){
	        	if (err) throw err;
	        	console.log('finished reading files:',files);
	        }
	    );

		
### files( dir, callback )
iterate all files in the directory and its subdirectories and pass their file-system paths to a callback

#### example
	    var dir = require('node-dir');
	    dir.filePaths(__dirname, function(err, files) {
	    	if (err) throw err;
	    	console.log(files);
	    });

		
### subdirs( dir, callback )
iterate all subdirectories in the directory (recursive) and pass their file-system paths to a callback

#### example
	 	var dir = require('node-dir');
		dir.subdirs(__dirname, function(err, subdirs) {
			if (err) throw err;
			console.log(subdirs);
		});
		

### paths (dir, [combine], callback )
iterate all files and subdirs in the directory (recursive) and  pass their file-system paths to a callback

#### example
	 	var dir = require('node-dir');
		// by default returns an object containing two array properties (files and dirs)
		dir.paths(__dirname, function(err, paths) {
			if (err) throw err;
			console.log('files:\n',paths.files);
			console.log('subdirs:\n', paths.dirs);
		});
		// combine both files and subdirs into a single array
		dir.paths(__dirname, true, function(err, paths) {
			if (err) throw err;
			console.log('paths:\n',paths);
		});
		
## License
MIT licensed (SEE LICENSE.txt)
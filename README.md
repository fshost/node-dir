## node-dir
asynchronous recursive file and directory operations for Node.js

## methods

### readFiles
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

### filePaths
get an array of file-system paths for all files in the directory and its subdirectories

#### example
	    var dir = require('node-dir');
	    dir.filePaths(__dirname, function(err, files) {
	    	if (err) throw err;
	    	console.log(files);
	    });

### subDirs
get an array of file-system path for all subdirectories, including nested subdirs

#### example
	 	var dir = require('node-dir');
		dir.subDirs(__dirname, function(err, dirs) {
			if (err) throw err;
			console.log(dirs);
		});
		
## License
MIT licensed (SEE LICENSE.txt)
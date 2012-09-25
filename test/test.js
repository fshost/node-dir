var path = require('path'),
	assert = require('assert'),
	dir = require('..'),
	tdir = __dirname + '/testdir';

// TODO: assert callback arguments to be as expected from test data
dir.readFiles(tdir,
    function(err, content, next) {
	
        if (err) throw err;
        console.log(content);
        next();
		
    },
    function(err, files){
	
        if (err) throw err;
        console.log(files);
		
		dir.subDirs(tdir, function(err, dirs) {
		
			if (err) throw err;
			console.log('dirs:', dirs);
			
		});

		dir.filePaths(tdir, function(err, files) {
		
			if (err) throw err;
			console.log('files:', files);
			
		});
    }
);
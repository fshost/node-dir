var path = require('path'),
	assert = require('assert'),
	dir = require('..'),
	tdir = __dirname + '/testdir';

// TODO: assert callback arguments to be as expected from test data

/*

console.log('\n');

console.log('test exports.paths:');
exports.paths('../test/testdir', function (err, paths) {
	if (err) throw err;
	console.log('files:', paths.files);
	console.log('subdirs:', paths.dirs);
	

	console.log('\ntest exports.paths (combined):');
	exports.paths('../test/testdir', true, function (err, paths) {
		if (err) throw err;
		console.log('paths:',paths);
		
		console.log('\n');
exports.subdirs('../test/testdir', function(err, dirs) { console.log(dirs); });
console.log('\n');
exports.files('../test/testdir', function(err, files) { console.log(files); });
	});
});
*/


console.log('\n### test reading contents of all files in dir and subdirs ###\n');

dir.readFiles(tdir,
    function(err, content, next) {
	
		console.log('\t## executing callback for file content ##\n');
        if (err) throw err;
		content = content.split('\n').map(function(val) { return '\t\t' + val; }).join('');
        console.log(content,'\n');
        next();
		
    },
    function(err, files){
	
		console.log('\n\t## executing readFiles complete callback ##\n');
		
        if (err) throw err;
        files.forEach(function(val) { console.log('\t\t',val); });
		
		console.log('\n\n### test getting all subdir paths ###\n');
		
		dir.subdirs(tdir, function(err, dirs) {
		
			if (err) throw err;
			dirs.forEach(function(val) { console.log('\t',val); });
			
			console.log('\n\n### test getting all file paths ###\n');
			
			dir.files(tdir, function(err, files) {
			
				if (err) throw err;
				files.forEach(function(val) { console.log('\t',val); });
				
				console.log('\n\n### test getting all subdirs and files ###\n');
				
				dir.paths(tdir, function(err, paths) {
				
					if (err) throw err;
					console.log('\tsubdirs:');
					paths.dirs.forEach(function(val) { console.log('\t\t',val); });
					console.log('\tfiles:');
					paths.files.forEach(function(val) { console.log('\t\t',val); });
					
					console.log('\n\n### test getting all subdirs and files (combined) ###\n');
					dir.paths(tdir, true, function(err, paths) {
					
						if (err) throw err;
						
						console.log('\tpaths:');
						paths.forEach(function(val) { console.log('\t\t',val); });
						console.log('\n\n### test getting all subdirs and files (combined) ###\n');
						console.log('\n\ntests complete!\n');
							
					});
					
				});
				
				
			});
			
			
		});

		
    }
);
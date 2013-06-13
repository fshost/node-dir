var path = require('path');

var chai = require('chai');
var expect = chai.expect;
chai.should();

var dir = require('..'),
    tdir = __dirname + '/testdir';

var filenames = [];

describe('readfiles method', function() {
    it('should exec a callback on every file contents and exec a done callback', function(done) {
        dir.readFiles(
            tdir, function(err, content, filename, next) {
            expect(err).to.equal(null);
            content = content.replace(/\r/g, '');
            var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
            var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
            filenames.push(shortName);
            content.should.equal(expected);
            next();
        }, function(err, files) {
            expect(err).to.equal(null);
            var relFiles = files.map(function(curPath) {
                return path.relative(__dirname, curPath);
            });
            relFiles.should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.txt',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.txt'
            ]);
            filenames.should.eql(['file1', 'file2', 'file3', 'file4']);
            done();
        });
    });
});

describe('readFiles method', function() {
    it('should pass the name and content of every filepath in a directory and subdirectories to a callback, and pass an array of the filepaths of every file in a directory and its subdirectories to a callback when complete', function(done) {
        dir.files(tdir, function(err, files) {
            expect(err).to.equal(null);
            var relFiles = files.map(function(curPath) {
                return path.relative(__dirname, curPath);
            });
            relFiles.should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.txt',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.txt'
            ]);
            done();
        });
    });
});

describe('subdirs method', function() {
    it('should pass an array of the subdir paths of every subdir in a directory (recursive) to a callback', function(done) {
        dir.subdirs(tdir, function(err, dirs) {
            expect(err).to.equal(null);
            var relPaths = dirs.map(function(curPath) {
                return path.relative(__dirname, curPath);
            });
            relPaths.length.should.equal(1);
            relPaths[0].should.equal('testdir/subdir');
            done();
        });

    });
});

describe('paths method', function() {
    it('should pass an object with a files property and dirs property of the paths of every file and subdir, respectively, in a directory (recursive) to a callback', function(done) {
        dir.paths(tdir, function(err, paths) {
            expect(err).to.equal(null);
            paths.should.be.an('object');
            paths.should.not.be.an('array');
            expect(paths.files).to.exist;
            expect(paths.dirs).to.exist;
            var relFiles = paths.files.map(function(curPath) {
                return path.relative(__dirname, curPath);
            });
            var relPaths = paths.dirs.map(function(curPath) {
                return path.relative(__dirname, curPath);
            });
            relFiles.should.eql([
                'testdir/file1.txt',
                'testdir/file2.txt',
                'testdir/subdir/file3.txt',
                'testdir/subdir/file4.txt'
            ]);
            relPaths.length.should.equal(1);
            relPaths[0].should.equal('testdir/subdir');
            done();
        });
    });

    describe('when called with combine argument set to true', function() {
        it(' should pass an array of filepaths of all subdirs and files in a directory and its subdirs to a callback', function(done) {
            dir.paths(tdir, true, function(err, paths) {
                expect(err).to.equal(null);
                paths.should.be.an('array');
                var relPaths = paths.map(function(curPath) {
                    return path.relative(__dirname, curPath);
                });
                relPaths.should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.txt',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.txt',
                    'testdir/subdir'
                ]);
            });
            done();
        });
    });

});
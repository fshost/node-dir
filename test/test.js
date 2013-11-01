var path = require('path'),
    should = require('should'),
    dir = require('..'),
    fixturesDir = path.join(__dirname, 'fixtures'),
    tdir = path.join(fixturesDir, 'testdir'),
    tdir2 = path.join(fixturesDir, 'testdir2');

describe('readfiles method', function() {

    it('should pass the contents of every file to a callback', function(done) {
        dir.readFiles(
            tdir, function(err, content, filename, next) {
                should.not.exist(err);
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                content.replace(/\r/g, '').should.equal(expected);
                next();
            }, function() {
                done();
            });
    });

    it('should invoke a done callback after processing all files', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, function(err, content, filename, next) {
                should.not.exist(err);
                should.exist(content);
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                filenames.push(shortName);
                next();
            }, function(err, files) {
                should.not.exist(err);
                files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                }).sort().should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.text'
                ]);
                filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('should read files in sorted order if the sort option is set to true', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
                sort: true
            }, function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                filenames.push(shortName);
                content.should.equal(expected);
                next();
            }, function(err, files) {
                should.not.exist(err);
                var relFiles = files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relFiles.should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.text'
                ]);
                filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('should read files in sorted order (per directory) if the sort option is set to true', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
                sort: true
            }, function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                filenames.push(shortName);
                content.should.equal(expected);
                next();
            }, function(err, files) {
                should.not.exist(err);
                var relFiles = files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relFiles.should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.text'
                ]);
                filenames.should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('should read files in reverse order (per directory) if the reverse option is set to true', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
                reverse: true
            }, function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                filenames.push(shortName);
                content.should.equal(expected);
                next();
            }, function(err, files) {
                should.not.exist(err);
                var relFiles = files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relFiles.should.eql([
                    'testdir/subdir/file4.text',
                    'testdir/subdir/file3.txt',
                    'testdir/file2.text',
                    'testdir/file1.txt'
                ]);
                filenames.should.eql(['file4', 'file3', 'file2', 'file1']);
                done();
            });
    });

    it('should apply a filter to the files if a filter option is specified', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
                filter: function(filename) {
                    return~ filename.search('file1') || ~filename.search('file2');
                }
            }, function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                filenames.push(shortName);
                content.should.equal(expected);
                next();
            }, function(err, files) {
                should.not.exist(err);
                var relFiles = files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relFiles.should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text'
                ]);
                filenames.should.eql(['file1', 'file2']);
                done();
            });
    });

    it('should accept an string argument that can specify encoding', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, 'ascii', function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                content.should.equal(expected);
                filenames.push(shortName);
                next();
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('should accept an options argument that can specify encoding', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
                encoding: 'ascii'
            }, function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                content.should.equal(expected);
                filenames.push(shortName);
                next();
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('if shortName option is true, only aggregate the base filename rather than the full filepath', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
                shortName: true
            }, function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                path.basename(filename).should.equal(filename);
                var shortName = filename.replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                content.should.equal(expected);
                filenames.push(filename);
                next();
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file1.txt', 'file2.text', 'file3.txt', 'file4.text']);
                done();
            });
    });

    it('if recursive option is set to false, should not read files in subdirectories', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
                recursive: false
            }, function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                filenames.push(shortName);
                content.should.equal(expected);
                next();
            }, function(err, files) {
                should.not.exist(err);
                var relFiles = files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relFiles.sort().should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text'
                ]);
                filenames.sort().should.eql(['file1', 'file2']);
                done();
            });
    });

    it('if given a match option, should only read files that match it', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
                match: /txt$/
            }, function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                content.should.equal(expected);
                filenames.push(shortName);
                next();
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file1', 'file3']);
                done();
            });
    });

    it('match option should match pattern only to the filename itself, not the full filepath', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
                match: /^file/
            }, function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                filenames.push(shortName);
                content.should.equal(expected);
                next();
            }, function(err, files) {
                should.not.exist(err);
                var relFiles = files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relFiles.sort().should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.text'
                ]);
                filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('if match option should match pattern only to the filename itself, not the full filepath', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
                match: /^file/
            }, function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                filenames.push(shortName);
                content.should.equal(expected);
                next();
            }, function(err, files) {
                should.not.exist(err);
                var relFiles = files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relFiles.sort().should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.text'
                ]);
                filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('if given an exclude option, should only read files that do not match the exclude pattern', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
                exclude: /text$/
            }, function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                content.should.equal(expected);
                filenames.push(shortName);
                next();
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file1', 'file3']);
                done();
            });
    });

    it('if given a matchDir option, should only read files in subdirectories that match it', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir2, {
                matchDir: /special/i
            }, function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                content.should.equal(expected);
                filenames.push(shortName);
                next();
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file3', 'file4']);
                done();
            });
    });

    it('if given an excludeDir option, should only read files that are not in subdirectories that match the exclude pattern', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir2, {
                excludeDir: /^\./
            }, function(err, content, filename, next) {
                should.not.exist(err);
                content = content.replace(/\r/g, '');
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                content.should.equal(expected);
                filenames.push(shortName);
                next();
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file2', 'file3', 'file4']);
                done();
            });
    });

    it('can be called with a callback in which the filename argument is omitted', function(done) {
        dir.readFiles(
            tdir, function(err, content, next) {
                should.not.exist(err);
                content.should.be.a.string;
                content.indexOf('begin content of').should.equal(0);
                next();
            }, function(err) {
                should.not.exist(err);
                done();
            });
    });

    it('can be called with the done callback argument omitted', function(done) {
        var i = 0;
        dir.readFiles(
            tdir, function(err, content, next) {
                should.not.exist(err);
                next();
                i++;
                if (i === 4) done();
            });
    });

});


describe("files method", function() {

    it("should iterate the files of a directory (recursively) and pass their filenames to a callback", function(done) {
        dir.files(tdir, function(err, files) {
            should.not.exist(err);
            var relFiles = files.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            relFiles.sort().should.eql([
                'testdir/file1.txt',
                'testdir/file2.text',
                'testdir/subdir/file3.txt',
                'testdir/subdir/file4.text'
            ]);
            done();
        });
    });

});



describe('subdirs method', function() {
    it('should pass an array of the subdir paths of every subdir in a directory (recursive) to a callback', function(done) {
        dir.subdirs(tdir, function(err, dirs) {
            should.not.exist(err);
            var relPaths = dirs.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
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
            should.not.exist(err);
            paths.should.be.a.object;
            paths.should.not.be.a.array;
            should.exist(paths.files);
            should.exist(paths.dirs);
            var relFiles = paths.files.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            var relPaths = paths.dirs.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            relFiles.sort().should.eql([
                'testdir/file1.txt',
                'testdir/file2.text',
                'testdir/subdir/file3.txt',
                'testdir/subdir/file4.text'
            ]);
            relPaths.length.should.equal(1);
            relPaths[0].should.equal('testdir/subdir');
            done();
        });
    });

    describe('when called with combine argument set to true', function() {

        it('should pass an array of filepaths of all subdirs and files in a directory and its subdirs to a callback', function(done) {
            dir.paths(tdir, true, function(err, paths) {
                should.not.exist(err);

                paths.should.be.a.array;
                var relPaths = paths.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relPaths.sort().should.eql([
                    'testdir/file1.txt',
                    'testdir/file2.text',
                    'testdir/subdir',
                    'testdir/subdir/file3.txt',
                    'testdir/subdir/file4.text'
                ]);
            });
            done();
        });

    });

});
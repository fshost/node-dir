var path = require('path'),
    should = require('should'),
    dir = require('..'),
    fixturesDir = path.join(__dirname, 'fixtures'),
    tdir = path.join(fixturesDir, 'testdir'),
    tdir2 = path.join(fixturesDir, 'testdir2'),
    tdir3 = path.join(fixturesDir, 'testdir3'),
    tdir4 = path.join(fixturesDir, 'testdir4'),
    tdir5 = path.join(fixturesDir, 'testdir5'),
    assert = require('assert'),
    isWin = require('os').type()=='Windows_NT',
    winIt = isWin ? it.skip : it

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
                    'testdir'+path.sep+'file1.txt',
                    'testdir'+path.sep+'file2.text',
                    'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                    'testdir'+path.sep+'subdir'+path.sep+'file4.text'
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
                    'testdir'+path.sep+'file1.txt',
                    'testdir'+path.sep+'file2.text',
                    'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                    'testdir'+path.sep+'subdir'+path.sep+'file4.text'
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
                    'testdir'+path.sep+'file1.txt',
                    'testdir'+path.sep+'file2.text',
                    'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                    'testdir'+path.sep+'subdir'+path.sep+'file4.text'
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
                    'testdir'+path.sep+'subdir'+path.sep+'file4.text',
                    'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                    'testdir'+path.sep+'file2.text',
                    'testdir'+path.sep+'file1.txt'
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
                    'testdir'+path.sep+'file1.txt',
                    'testdir'+path.sep+'file2.text'
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
                    'testdir'+path.sep+'file1.txt',
                    'testdir'+path.sep+'file2.text'
                ]);
                filenames.sort().should.eql(['file1', 'file2']);
                done();
            });
    });

    it('if given a match regex option, should only read files that match it', function(done) {
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

    it('if given a match array option, should only read files that match an item in the array', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
                match: ['file1.txt', 'file3.txt']
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

    it('match option should match regex pattern only to the filename itself, not the full filepath', function(done) {
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
                    'testdir'+path.sep+'file1.txt',
                    'testdir'+path.sep+'file2.text',
                    'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                    'testdir'+path.sep+'subdir'+path.sep+'file4.text'
                ]);
                filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('if given an exclude regex option, should only read files that do not match the exclude pattern', function(done) {
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

    it('if given an exclude array option, should only read files that do not match any items in the array', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir, {
                exclude: ['file2.text', 'file4.text']
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

    it('if given a matchDir regex option, should only read files in subdirectories that match it', function(done) {
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

    it('if given a matchDir array option, should only read files in subdirectories that match an item in the array', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir2, {
                matchDir: ['special_files', 'nonexistent']
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

    it('if given an excludeDir regex option, should only read files that are not in subdirectories that match the exclude pattern', function(done) {
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

    it('if given an excludeDir array option, should only read files that are in subdirectories that do not match any item in the array', function(done) {
        var filenames = [];
        dir.readFiles(
            tdir2, {
                excludeDir: ['.bin', '.nonexistent']
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

    it('should done on error', function(done) {
        dir.readFiles(
            tdir3, function(err, content, filename, next) {
                should.not.exist(err);
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                content.replace(/\r/g, '').should.equal(expected);
                next();
            }, function(err) {
                should.exist(err);
                done();
            });
    });

    it('if given doneOnErr to false, should not done on error', function(done) {
        dir.readFiles(
            tdir3, { doneOnErr: false },function(err, content, filename, next) {
                if(filename.split(path.sep).pop()!='file1.txt')return next()
                should.not.exist(err);
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                content.replace(/\r/g, '').should.equal(expected);
                next();
            }, function() {
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

describe('readfilesstream method', function() {

    it('should pass the stream of every file to a callback', function(done) {
        dir.readFilesStream(
            tdir, function(err, stream, filename, next) {
                should.not.exist(err);
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                var content = '';
                stream.on('data',function(buffer) {
                  var part = buffer.toString();
                  content += part;
                });
                stream.on('end',function() {
                  content.replace(/\r/g, '').should.equal(expected);
                  next();
                });
                
            }, function() {
                done();
            });
    });
    it('should invoke a done callback after processing all files', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, function(err, stream, filename, next) {
                should.not.exist(err);
                should.exist(stream);
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                filenames.push(shortName);
                next();
            }, function(err, files) {
                should.not.exist(err);
                files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                }).sort().should.eql([
                    'testdir'+path.sep+'file1.txt',
                    'testdir'+path.sep+'file2.text',
                    'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                    'testdir'+path.sep+'subdir'+path.sep+'file4.text'
                ]);
                filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('should read files in sorted order if the sort option is set to true', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, {
                sort: true
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                //content = content.replace(/\r/g, '');
                var content = '';
                stream.on('data',function(buffer) {
                  var part = buffer.toString();
                  content += part;
                });
                stream.on('end',function() {
                  content = content.replace(/\r/g, '');
                  var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                  var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                  filenames.push(shortName);
                  content.should.equal(expected);
                  next();
                });
            }, function(err, files) {
                should.not.exist(err);
                var relFiles = files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relFiles.should.eql([
                    'testdir'+path.sep+'file1.txt',
                    'testdir'+path.sep+'file2.text',
                    'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                    'testdir'+path.sep+'subdir'+path.sep+'file4.text'
                ]);
                filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('should read files in sorted order (per directory) if the sort option is set to true', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, {
                sort: true
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                  var part = buffer.toString();
                  content += part;
                });
                stream.on('end',function() {
                  content = content.replace(/\r/g, '');
                  var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                  var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                  filenames.push(shortName);
                  content.should.equal(expected);
                  next();
                });
            }, function(err, files) {
                should.not.exist(err);
                var relFiles = files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relFiles.should.eql([
                    'testdir'+path.sep+'file1.txt',
                    'testdir'+path.sep+'file2.text',
                    'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                    'testdir'+path.sep+'subdir'+path.sep+'file4.text'
                ]);
                filenames.should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('should read files in reverse order (per directory) if the reverse option is set to true', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, {
                reverse: true
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                  var part = buffer.toString();
                  content += part;
                });
                stream.on('end',function() {
                  content = content.replace(/\r/g, '');
                  var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                  var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                  filenames.push(shortName);
                  content.should.equal(expected);
                  next();
                });
            }, function(err, files) {
                should.not.exist(err);
                var relFiles = files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relFiles.should.eql([
                    'testdir'+path.sep+'subdir'+path.sep+'file4.text',
                    'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                    'testdir'+path.sep+'file2.text',
                    'testdir'+path.sep+'file1.txt'
                ]);
                filenames.should.eql(['file4', 'file3', 'file2', 'file1']);
                done();
            });
    });

    it('should apply a filter to the files if a filter option is specified', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, {
                filter: function(filename) {
                    return~ filename.search('file1') || ~filename.search('file2');
                }
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                    content = content.replace(/\r/g, '');
                    var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                    var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                    filenames.push(shortName);
                    content.should.equal(expected);
                    next();
                });
            }, function(err, files) {
                should.not.exist(err);
                var relFiles = files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relFiles.should.eql([
                    'testdir'+path.sep+'file1.txt',
                    'testdir'+path.sep+'file2.text'
                ]);
                filenames.should.eql(['file1', 'file2']);
                done();
            });
    });

    it('should accept an string argument that can specify encoding', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, 'ascii', function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                    content = content.replace(/\r/g, '');
                    var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                    var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                    content.should.equal(expected);
                    filenames.push(shortName);
                    next();
                });
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('should accept an options argument that can specify encoding', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, {
                encoding: 'ascii'
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                    content = content.replace(/\r/g, '');
                    var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                    var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                    content.should.equal(expected);
                    filenames.push(shortName);
                    next();
                });
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('if shortName option is true, only aggregate the base filename rather than the full filepath', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, {
                shortName: true
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                    content = content.replace(/\r/g, '');
                    path.basename(filename).should.equal(filename);
                    var shortName = filename.replace(new RegExp(path.extname(filename) + '$'), '');
                    var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                    content.should.equal(expected);
                    filenames.push(filename);
                    next();
                });
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file1.txt', 'file2.text', 'file3.txt', 'file4.text']);
                done();
            });
    });

    it('if recursive option is set to false, should not read files in subdirectories', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, {
                recursive: false
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                    content = content.replace(/\r/g, '');
                    var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                    var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                    filenames.push(shortName);
                    content.should.equal(expected);
                    next();
                });
            }, function(err, files) {
                should.not.exist(err);
                var relFiles = files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relFiles.sort().should.eql([
                    'testdir'+path.sep+'file1.txt',
                    'testdir'+path.sep+'file2.text'
                ]);
                filenames.sort().should.eql(['file1', 'file2']);
                done();
            });
    });

    it('if given a match regex option, should only read files that match it', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, {
                match: /txt$/
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                    content = content.replace(/\r/g, '');
                    var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                    var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                    content.should.equal(expected);
                    filenames.push(shortName);
                    next();
                });
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file1', 'file3']);
                done();
            });
    });

    it('if given a match array option, should only read files that match an item in the array', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, {
                match: ['file1.txt', 'file3.txt']
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                  content = content.replace(/\r/g, '');
                  var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                  var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                  content.should.equal(expected);
                  filenames.push(shortName);
                  next();
                });
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file1', 'file3']);
                done();
            });
    });

    it('match option should match regex pattern only to the filename itself, not the full filepath', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, {
                match: /^file/
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                    content = content.replace(/\r/g, '');
                    var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                    var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                    filenames.push(shortName);
                    content.should.equal(expected);
                    next();
                });
            }, function(err, files) {
                should.not.exist(err);
                var relFiles = files.map(function(curPath) {
                    return path.relative(fixturesDir, curPath);
                });
                relFiles.sort().should.eql([
                    'testdir'+path.sep+'file1.txt',
                    'testdir'+path.sep+'file2.text',
                    'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                    'testdir'+path.sep+'subdir'+path.sep+'file4.text'
                ]);
                filenames.sort().should.eql(['file1', 'file2', 'file3', 'file4']);
                done();
            });
    });

    it('if given an exclude regex option, should only read files that do not match the exclude pattern', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, {
                exclude: /text$/
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                    content = content.replace(/\r/g, '');
                    var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                    var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                    content.should.equal(expected);
                    filenames.push(shortName);
                    next();
                });
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file1', 'file3']);
                done();
            });
    });

    it('if given an exclude array option, should only read files that do not match any items in the array', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir, {
                exclude: ['file2.text', 'file4.text']
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                    content = content.replace(/\r/g, '');
                    var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                    var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                    content.should.equal(expected);
                    filenames.push(shortName);
                    next();
                });
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file1', 'file3']);
                done();
            });
    });

    it('if given a matchDir regex option, should only read files in subdirectories that match it', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir2, {
                matchDir: /special/i
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                    content = content.replace(/\r/g, '');
                    var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                    var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                    content.should.equal(expected);
                    filenames.push(shortName);
                    next();
                });
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file3', 'file4']);
                done();
            });
    });

    it('if given a matchDir array option, should only read files in subdirectories that match an item in the array', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir2, {
                matchDir: ['special_files', 'nonexistent']
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                    content = content.replace(/\r/g, '');
                    var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                    var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                    content.should.equal(expected);
                    filenames.push(shortName);
                    next();
                });
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file3', 'file4']);
                done();
            });
    });

    it('if given an excludeDir regex option, should only read files that are not in subdirectories that match the exclude pattern', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir2, {
                excludeDir: /^\./
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                  content = content.replace(/\r/g, '');
                  var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                  var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                  content.should.equal(expected);
                  filenames.push(shortName);
                  next();
                });
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file2', 'file3', 'file4']);
                done();
            });
    });

    it('if given an excludeDir array option, should only read files that are in subdirectories that do not match any item in the array', function(done) {
        var filenames = [];
        dir.readFilesStream(
            tdir2, {
                excludeDir: ['.bin', '.nonexistent']
            }, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                    content = content.replace(/\r/g, '');
                    var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                    var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                    content.should.equal(expected);
                    filenames.push(shortName);
                    next();
                });
            }, function(err, files) {
                should.not.exist(err);
                filenames.sort().should.eql(['file2', 'file3', 'file4']);
                done();
            });
    });

    it('should done on error', function(done) {
        dir.readFilesStream(
            tdir3, function(err, stream, filename, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                    content = content.replace(/\r/g, '');
                    var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                    var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                    content.should.equal(expected);
                    filenames.push(shortName);
                    next();
                });
            }, function(err) {
                should.exist(err);
                done();
            });
    });

    it('if given doneOnErr to false, should not done on error', function(done) {
        dir.readFilesStream(
            tdir3, { doneOnErr: false },function(err, stream, filename, next) {
                if(filename.split(path.sep).pop()!='file1.txt')return next()
                should.not.exist(err);
                var shortName = path.basename(filename).replace(new RegExp(path.extname(filename) + '$'), '');
                var expected = 'begin content of ' + shortName + '\ncontent body\nend content of ' + shortName;
                var content = '';
                stream.on('data',function(buffer) {
                  var part = buffer.toString();
                  content += part;
                });
                stream.on('end',function() {
                  content.replace(/\r/g, '').should.equal(expected);
                  next();
                });
            }, function() {
                done();
            });
    });

    it('can be called with a callback in which the filename argument is omitted', function(done) {
        dir.readFilesStream(
            tdir, function(err, stream, next) {
                should.not.exist(err);
                var content = '';
                stream.on('data',function(buffer) {
                    var part = buffer.toString();
                    content += part;
                });
                stream.on('end',function() {
                  content.should.be.a.string;
                  content.indexOf('begin content of').should.equal(0);
                  next();
                });
            }, function(err) {
                should.not.exist(err);
                done();
            });
    });

    it('can be called with the done callback argument omitted', function(done) {
        var i = 0;
        dir.readFilesStream(
            tdir, function(err, stream, next) {
                should.not.exist(err);
                next();
                i++;
                if (i === 4) done();
            });
    });
});

describe('#promiseFiles',function(){
    it("#promiseFiles", function(done) {
        dir.promiseFiles(tdir)
        .then(function(files) {
            var relFiles = files.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            relFiles.sort().should.eql([
                'testdir'+path.sep+'file1.txt',
                'testdir'+path.sep+'file2.text',
                'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                'testdir'+path.sep+'subdir'+path.sep+'file4.text'
            ]);
        })
        .then(done).catch(done)
    });

    it("#promiseFiles(path, {shortName:true})", function(done) {
        dir.promiseFiles(tdir, {shortName:true})
        .then(function(files) {
            assert.deepEqual(files.sort(), [
                'file1.txt',
                'file2.text',
                'file3.txt',
                'file4.text'
            ])
        })
        .then(done).catch(done)
    });

    it("#promiseFiles(path, 'combine', {shortName:true})", function(done) {
        dir.promiseFiles(tdir, 'combine', {shortName:true})
        .then(function(files) {
            assert.deepEqual(files.sort(), [
                'file1.txt',
                'file2.text',
                'file3.txt',
                'file4.text',
                'subdir'
            ])
        })
        .then(done).catch(done)
    });

    it("#promiseFiles(path, 'combine', {shortName:'relative'})", function(done) {
        dir.promiseFiles(tdir, 'combine', {shortName:'relative'})
        .then(function(files) {
            assert.deepEqual(files.sort(), [
                'file1.txt',
                'file2.text',
                'subdir',
                'subdir'+path.sep+'file3.txt',
                'subdir'+path.sep+'file4.text'
            ])
        })
        .then(done).catch(done)
    });
})


describe("files method", function() {

    it("#files(path, {sync:true})", 
        function() {
        var files = dir.files(tdir,'file',function(){},{sync:true});
        var relFiles = files.map(function(curPath) {
            return path.relative(fixturesDir, curPath);
        });

        relFiles.sort().should.eql([
            'testdir'+path.sep+'file1.txt',
            'testdir'+path.sep+'file2.text',
            'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
            'testdir'+path.sep+'subdir'+path.sep+'file4.text'
        ]);
    });

    it("should iterate the files of a directory (recursively) and pass their filenames to a callback", function(done) {
        dir.files(tdir, function(err, files) {
            should.not.exist(err);
            var relFiles = files.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            relFiles.sort().should.eql([
                'testdir'+path.sep+'file1.txt',
                'testdir'+path.sep+'file2.text',
                'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                'testdir'+path.sep+'subdir'+path.sep+'file4.text'
            ]);
            done();
        });
    });

    it("should return broken symlinks as files", function(done) {
        dir.files(tdir3, function(err, files) {
            should.not.exist(err);
            var relFiles = files.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            relFiles.sort().should.eql([
                'testdir3'+path.sep+'broken_link.txt',
                'testdir3'+path.sep+'file1.txt'
            ]);
            done();
        });
    });

    winIt("should iterate files of symlinked directories (recursively)", function(done) {
        dir.files(tdir4, function(err, files) {
            should.not.exist(err);
            var relFiles = files.map(function(curPath) {
                return path.relative(fixturesDir, curPath);
            });
            var testArray = [
                'testdir4'+path.sep+'testdir'+path.sep+'file1.txt',
                'testdir4'+path.sep+'testdir'+path.sep+'file2.text',
                'testdir4'+path.sep+'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                'testdir4'+path.sep+'testdir'+path.sep+'subdir'+path.sep+'file4.text'
            ]
            relFiles.sort().should.eql(testArray);
            done();
        });
    });

    //NOT supported everywhere
    it.skip("support non-UTF8 file names", function() {
        var files = dir.files(tdir5,'file', function(){}, {sync:true, excludeHidden:true});
        var cmp = Buffer.from('testdir5'+path.sep+'testuções.txt', 'latin1').toString();
        
        var relFile = path.relative(fixturesDir, files[0])
        relFile.should.eql(cmp)//This test does not pass on all Systems
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
            relPaths[0].should.equal('testdir'+path.sep+'subdir');
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
                'testdir'+path.sep+'file1.txt',
                'testdir'+path.sep+'file2.text',
                'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                'testdir'+path.sep+'subdir'+path.sep+'file4.text'
            ]);
            relPaths.length.should.equal(1);
            relPaths[0].should.equal('testdir'+path.sep+'subdir');
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
                    'testdir'+path.sep+'file1.txt',
                    'testdir'+path.sep+'file2.text',
                    'testdir'+path.sep+'subdir',
                    'testdir'+path.sep+'subdir'+path.sep+'file3.txt',
                    'testdir'+path.sep+'subdir'+path.sep+'file4.text'
                ]);
            });
            done();
        });

    });

});

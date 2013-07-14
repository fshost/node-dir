// var dir = require('./index');
// var fs = require('fs');

// function css(res) {
//     dir.files('./css', function(err, files) {
//         res.end(files.filter(function(file) {
//             return (/bootstrap(-responsive)?\.css$/i).test(file);
//         }).reverse().map(function(file) {
//             return fs.readFileSync(file).toString();
//         }).join(''));
//     });
// }
// function css(res) {
//     dir.readFiles('css', {
//         match: /bootstrap(-responsive)?\.css$/i
//     }, function(err, content, next) {
//         if (err) throw err;
//         res.write(content);
//         next();
//     }, res.end);
// }

// var result = '';
// var res = {
//     write: function (str) {
//         result += str;
//     },
//     end: function () {
//         console.log('result:', result);
//     }
// };

// css(res);

var a = [
    'testdir/file1.txt',
    'testdir/file2.text',
    'testdir/subdir/file3.txt',
    'testdir/subdir/file4.text'
];
console.log(a.reverse());
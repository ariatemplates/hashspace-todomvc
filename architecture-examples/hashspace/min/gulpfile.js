var fs  = require('fs');

var cheerio = require('cheerio');
var gulp = require('gulp');
var hsp = require('gulp-hashspace');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

var _srcFolder = '../';
var _destFolder = '../../hashspace-min/';

gulp.task('clean', function (done) {
    rimraf(_destFolder, function () {
        mkdirp(_destFolder, done);
    })
});

/**
 * Compiles .hsp and .js hashspace files
 */
gulp.task('hspCompile', ['clean'], function() {
    gulp.src(_srcFolder + 'js/**/*.+(hsp|js)').pipe(hsp.process()).pipe(gulp.dest(_destFolder + 'js'));
});

/**
 * Copy bower components and other useful files to the min folder
 */
gulp.task('copyStatic', ['clean'], function() {
    gulp.src(_srcFolder + 'bower_components/**/*').pipe(gulp.dest(_destFolder + 'bower_components'));
    gulp.src(_srcFolder + '{.gitignore,LICENSE,bower.json}').pipe(gulp.dest(_destFolder));
    gulp.src(_srcFolder + 'min/README.md').pipe(gulp.dest(_destFolder));
});

/**
 * Creates `min/index.html` out of `index.html` by stripping unnecessary parts
 */
gulp.task('makeIndex', ['clean'], function () {
    var inputFile = fs.readFileSync(_srcFolder + 'index.html').toString();

    // This loads the HTML from inputFile into a 'virtual DOM' with jquery-like syntax
    var $ = cheerio.load(inputFile);

    // get rid of hashspace-noder-compiler node entirely
    $('script[src$="hashspace-noder-compiler.js"]').remove();

    // use minified hashspace-noder
    var hsNoderScript = $('script[src$="hashspace-noder.js"]');
    hsNoderScript.attr("src", hsNoderScript.attr("src").replace("hashspace-noder.js", "hashspace-noder.min.js"));

    // use minified noder version
    var noderScript = $('script[src$="noder.dev.js"]');
    noderScript.attr("src", noderScript.attr("src").replace("noder.dev.js", "noder.min.js"));

    // tweak noder config, since some files are one now one directory up
    var noderConfig = noderScript.html();
    noderConfig = eval('(' + noderConfig + ')'); // eval instead of JSON.parse since input has regexes

    delete noderConfig['packaging'];

    noderConfig = JSON.stringify(noderConfig, null, "\t"); // output doesn't have regexes, can be stringified
    noderScript.html(noderConfig);

    var html = $.html();
    fs.writeFileSync(_destFolder + 'index.html', html);
});

gulp.task('default', ['hspCompile', 'copyStatic', 'makeIndex']);

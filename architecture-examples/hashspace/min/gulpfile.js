var fs  = require('fs');

var cheerio = require('cheerio');
var gulp = require('gulp');
var hsp = require('gulp-hashspace');
var rimraf = require('rimraf');

var _srcFolder = '../js';
var _destFolder = 'js';

var _srcIndex = '../index.html';
var _destIndex = 'index.html';

gulp.task('clean', function (done) {
    rimraf(_destFolder, done);
});

/**
 * Compiles .hsp and .js hashspace files
 */
gulp.task('hspCompile', ['clean'], function() {
    gulp.src(_srcFolder + '/**/*.+(hsp|js)').pipe(hsp.process()).pipe(gulp.dest(_destFolder));
});

/**
 * Creates `min/index.html` out of `index.html` by stripping unnecessary parts
 */
gulp.task('makeIndex', function () {
    var inputFile = fs.readFileSync(_srcIndex).toString();

    // This loads the HTML from inputFile into a 'virtual DOM' with jquery-like syntax
    var $ = cheerio.load(inputFile);

    // get rid of noder script config, and use minified version
    var noderScript = $('script[src$="noder.dev.js"]');
    noderScript.attr("src", noderScript.attr("src").replace("noder.dev.js", "noder.min.js"));
    noderScript.html('');

    var hsNoderScript = $('script[src$="hashspace-noder.js"]');
    hsNoderScript.attr("src", hsNoderScript.attr("src").replace("hashspace-noder.js", "hashspace-noder.min.js"));

    // get rid of hashspace-noder-compiler node entirely
    $('script[src$="hashspace-noder-compiler.js"]').remove();

    var html = $.html();

    // bower components are one dir up
    html = html.replace(/bower_components/g, '../bower_components');

    fs.writeFileSync(_destIndex, html);
});

gulp.task('default', ['hspCompile', 'makeIndex']);

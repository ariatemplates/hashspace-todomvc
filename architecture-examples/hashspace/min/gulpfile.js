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

    noderConfig['packaging'] = {
        baseUrl: '../'
    };
    noderConfig['resolver']['default']['js'] = 'min/js';

    noderConfig = JSON.stringify(noderConfig, null, "\t"); // output doesn't have regexes, can be stringified
    noderScript.html(noderConfig);

    // inline bower components are one dir up now too
    $('script[src^="bower_components"]').each(function () {
        $(this).attr('src', $(this).attr('src').replace('bower_components', '../bower_components'));
    });;
    $('link[href^="bower_components"]').each(function () {
        $(this).attr('href', $(this).attr('href').replace('bower_components', '../bower_components'));
    });

    var html = $.html();
    fs.writeFileSync(_destIndex, html);
});

gulp.task('default', ['hspCompile', 'makeIndex']);

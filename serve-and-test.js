#!/usr/bin/env node

var http = require('http');
var spawn = require('child_process').spawn;

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var server = null;

var bootServer = function () {
	var serve = serveStatic("./");

	server = http.createServer(function(req, res){
	  var done = finalhandler(req, res)
	  serve(req, res, done)
	});

	server.listen(8000);
};

var bootMocha = function () {
	var cmd = "node";
	var args = ["grunt-cli.js", "test", "--browser=phantomjs", "--gruntfile", "browser-tests/Gruntfile.js"];
	var opts = {
		stdio : "inherit"
	};
	var child = spawn(cmd, args, opts);
	child.on('exit', function () {
		if (server) {
			server.close(terminate);
		} else {
			terminate();
		}
	});
};

var terminate = function () {
	process.exit(0);
};

bootServer();
bootMocha();

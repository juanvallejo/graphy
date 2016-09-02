var flag = require('./flag/flag.js');

var command = {}

// parse command line arguments and flags.
// outputs a json object with arrays of
// flag objects and argument strings.
// receives an array of command line args.
// optionally receives a handler function.
command.parseArgs = function(argv, handler) {
	var flags = [];
	var args = [];
	var vars = [];
	var objects = {};

	for (var i = 0; i < argv.length; i++) {
		var f = argv[i].match(/^-(-)?.*/gi);
		var a = argv[i].match(/^[a-zA-Z0-9]+$/gi);

		if (f != null && f.length) {
			var flagKeyValueArray = command.parseFlag(f[0]);
			var flagObject = flag.newFromArray(flagKeyValueArray);
			flags.push(flagObject);
		} else if (a != null && a.length) {
			args.push(a[0]);
		}
	}

	objects = {
		flags: flags,
		args: args,
		vars: vars
	};

	if (typeof handler == 'function') {
		handler.call(command, objects);
	}

	return objects
};

// parse a command-line flag
// receives a string matching ^--[a-zA-Z0-9\-\_]+\=.*$
// returns an array containing a key and a value
command.parseFlag = function(flag) {
	if (!flag.match(/^-(-)?[a-zA-Z0-9\-\_]+(\=.*)?$/gi)) {
		console.log("Invalid flag \"" + flag + "\"\nFlags must only contain chars (A-Z0-9), -, _, and can be followed by an = and a value.");
		process.exit(1);
	}

	var pair = flag.split('=');
	if (!pair.length || pair.length < 2) {
		pair[1] = true;
	}

	return pair;
};

module.exports = command;

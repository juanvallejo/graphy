var exec = require('child_process').exec;

// define command tree module
var tree = {};

// traverses the command tree starting at specified node
tree.traverse = function(args, moduleObj, moduleArgs) {
	var oc = exec(args + ' -h');
	oc.stdout.on('data', function(data) {
		parse(data);
	});

	oc.stderr.on('data', function(data) {
		parse(data, true);
	});

	function parse(data, withErr) {
		if (typeof data == 'object') {
			data = data.toString();
		}

		var lines = data.split('\n');
		var lncount = lines.length;
		var cmds = [];
		var do_add = false;

		if (withErr && (!lncount || lncount < 2)) {
			console.log('Warning: received error output from command:', lines.join(' '));
		}

		for (var i = 0; i < lines.length; i++) {
			if (moduleObj && moduleObj.main(args, lines[i], i, moduleArgs)) {}

			if (do_add && lines[i] == '') {
				do_add = false;
			}
			if (do_add) {
				cmds.push(lines[i].replace(/^(\ )*/gi, '').split('\ ')[0]);
			}
			if (lines[i].match(/commands\:/gi)) {
				do_add = true;
			}
		}

		for (var i = 0; i < cmds.length; i++) {
			tree.traverse(args + ' ' + cmds[i], moduleObj, moduleArgs)
		}

	}

};

module.exports = tree;
// define command tree module
var tree = {};

// traverses the command tree starting at specified node
tree.traverse = function(args) {
	var oc = exec(args + ' -h');
	oc.stdout.on('data', function(data) {
		parse(data);
	});

	oc.stderr.on('data', function(data) {
		parse(data);
	});

	function parse(data) {
		if (typeof data == 'object') {
			data = data.toString();
		}

		var lines = data.split('\n');
		var lncoutn = lines.length;
		var cmds = [];
		var do_add = false;

		for (var i = 0; i < lines.length; i++) {
			if (lines[i].match(/\-\-dry\-run/gi)) {
				console.log('');
				console.log('Command Name:', args);
				console.log('--dry-run=:', lines[i].replace(/^(\ )+(.*)/gi, '$2'));
			}

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
			traverse(args + ' ' + cmds[i], cmds[i])
		}

	}

};

module.exports = tree;
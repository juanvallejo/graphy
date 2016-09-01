var fs = require('fs');

var modules = {};

// Module instance: receives an optional json
// object and instantiates with its properties
function Module(object) {

}

// reads *.graphy files into json objects from a
// specified location and creates module objects.
// receives a path and a required handler function
modules.parseAndImport = function(path, handler) {
	if (typeof handler != 'function') {
		throw "Invalid handler: must be of type \"function\"";
	}

	fs.readdir(path, function(err, files) {
		if (err) {
			return handler.call(modules, err, null);
		}

		parse_files(path, filter_filenames(files), function(err, objects) {
			if (err) {
				return handler.call(modules, err, null);
			}

			handler.call(modules, null, modules.newFromObjects(objects));
		});
	});
};

// receives an array of json objects and returns an
// array of parsed Module instances. if a json object
// is of invalid format, it is skipped.
modules.newFromObjects = function(objs) {
	// TODO return an array of Modules
};

// receives an array of filenames and filters out
// system files and non-graphy module files.
// returns reference to original, modified array
function filter_filenames(files) {
	for (var i = 0; i < files.length; i++) {
		var fparts = files[i].split('.')
		if (files[i].substring(0, 1) == '.' || !fparts.length || fparts[fparts.length - 1] != 'graphy') {
			files.splice(i--, 1);
		}
	}
	return files;
}

// receives a path to destination containing
// each filename in an array of filenames and
// parses each item's contents into json objects.
// if a file's json format is invalid, that file
// is omitted from the list of returned files.
// receives an optional callback function.
function parse_files(root_path, filenames, callback) {
	if (typeof callback != 'function') {
		callback = function(err) {
			if (err) {
				console.log(err);
			}
		}
	}

	var separator = '';
	if (root_path.substring(root_path.length - 1, root_path.length) != '/') {
		separator = '/';
	}

	// holds parsed module objects
	var objects = [];
	var parsedCount = 0;

	for (var i = 0; i < filenames.length; i++) {
		fs.readFile(root_path + separator + filenames[i], function(err, data) {
			return (function(err, filename) {
				if (err) {
					return callback.call('error: unable to read module file "' + filename + '":', err);
				}

				if (data.toString) {
					data = data.toString();
				}

				var obj = validate_json_string(data, function(e) {
					if (e) {
						console.log('err: invalid file format for "' + filename + '":', e);
					}
				});

				if (obj != null) {
					objects.push(obj);
				}

				if (++parsedCount == filenames.length) {
					callback.call(this, null, objects);
				}
			})(err, filenames[i]);
		});
	}
}

// receives a json formatted string and checks its validity.
// if string is of invalid format, null is returned, else
// a parsed json object is returned. if an optional handler
// function is provided, an error or parsed json object is
// passed to it with the other value being null.
function validate_json_string(str, handler) {
	if (typeof handler != 'function') {
		handler = function() {};
	}

	try {
		var json = JSON.parse(str);
		handler(null, json);
		return json;
	} catch (e) {
		handler(e, null);
		return null;
	}
}

module.exports = modules;
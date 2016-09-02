var fs = require('fs');

var modules = {};

// Module instance: receives an optional json
// object and instantiates with its properties
function Module(object) {
	this.name = object.name || 'untitled';
	this.description = object.description || 'No description.';

	// assign main method
	this.main = object.main || function(args) {
		console.log('ERR MODULE<' + this.name + '> Corrupt module; missing main method.');
	};

	this.getName = function() {
		return this.name;
	};
}

// reads *.graphy files into js objects from a
// specified location and creates module objects.
// receives a path and a required handler function
modules.readAndImport = function(path, handler) {
	if (typeof handler != 'function') {
		throw "Invalid handler: must be of type \"function\"";
	}

	modules.readFromPath(path, function(err, files) {
		if (err) {
			return handler.call(modules, err, null);
		}

		modules.importFromPath(path, files, handler);
	});
};

// reads *.graphy files into js objects from a
// specified location and returns an array of
// filenames consisting of a full or relative path
// to each module file.
modules.readFromPath = function(path, handler) {
	if (typeof handler != 'function') {
		throw "Invalid handler: must be of type \"function\"";
	}

	fs.readdir(path, function(err, files) {
		if (err) {
			return handler.call(modules, err, null);
		}

		handler.call(modules, null, filter_filenames(files));
	});
};

// receives a base path and an array of filenames consisting
// of a full or relative path to each module file and imports
// and validates each file into a Module object.
// receives a required handler function that takes an error
// and an array of valid Module files as its only arguments
modules.importFromPath = function(path, files, handler) {
	if (typeof handler != 'function') {
		throw "Invalid handler: must be of type \"function\"";
	}
	parse_files(path, files, function(err, objects) {
		if (err) {
			return handler.call(modules, err, null);
		}

		handler.call(modules, null, modules.newFromObjects(objects));
	});
};

// receives an array of json objects and returns an
// array of parsed Module instances. if a json object
// is of invalid format, it is skipped.
modules.newFromObjects = function(objs) {
	var objects = [];
	for (var i = 0; i < objs.length; i++) {
		var obj = validate_object(objs[i]);
		if (obj != null) {
			objects.push(new Module(objs[i]));
			continue;
		}
		console.log('Invalid module object', objs[i]);
	}
	return objects;
};

// receives a list of Module objects and returns a single
// Module matching a given moduleName, or null if none exists
modules.getModuleByName = function(moduleObjs, moduleName) {
	for (var i = 0; i < moduleObjs.length; i++) {
		if (moduleObjs[i].getName() == moduleName) {
			return moduleObjs[i];
		}
	}
	return null;
}

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
// parses each item's contents into js objects.
// if a file's format is invalid, that file
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
	var errs = [];

	for (var i = 0; i < filenames.length; i++) {
		try {
			var obj = require(root_path + separator + filenames[i]);
			objects.push(obj);
		} catch (e) {
			console.log('error: unable to read module file "' + filenames[i] + '":', e);
			errs.push(e);
		}
	}

	if (errs.length) {
		return callback.call(this, errs, objects);
	}

	callback.call(this, null, objects);
}

// receives a json object and checks its validity.
// returns a null value if no valid or supported
// module fields are found, otherwise returns
// the originally passed json object.
// 
// mininum required "valid" fields are:
//  "name": [string]   name of the module
//  "main": [function] entry point of module
function validate_object(obj) {
	if (!obj.name || !obj.main || !(typeof obj.main == 'function')) {
		return null;
	}
	return obj;
}

// receives a json formatted string and checks its validity.
// if string is of invalid format, null is returned, else
// a parsed json object is returned. if an optional handler
// function is provided, an error or parsed json object is
// passed to it with the other value being null.
function validate_object_string(str, handler) {
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
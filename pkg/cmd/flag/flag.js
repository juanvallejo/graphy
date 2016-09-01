// command flag object used to store key-value pairs
// of user-generated command line information
function Flag(key, value) {
	this.key = key || '';
	this.value = value || '';
	this.name = key.replace(/^(-){1,2}/gi, '')

	this.getValue = function() {
		return this.value;
	}
}

// define static methods
var flag = {};

flag.Flag = Flag;

// receives an array with two indices
// andcreates a new flag
flag.newFromArray = function(pair) {
	return new Flag(pair[0], pair[1]);
};

// receives an array of Flag objects and
// determines if a flag with the specified
// flagname exists in the array
flag.hasFlag = function(flags, flagname) {
	for (var i = 0; i < flags.length; i++) {
		if (flags[i].name == flagname) {
			return true;
		}
	}
	return false;
}

flag.getFlag = function(flags, flagname) {
	for (var i = 0; i < flags.length; i++) {
		if (flags[i].name == flagname) {
			return flags[i];
		}
	}
	return null;
}

module.exports = flag;
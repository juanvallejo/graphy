var aliases = require('./aliases.js');

// command flag object used to store key-value pairs
// of user-generated command line information
function Flag(key, value) {
	this.key = key || '';
	this.value = value || '';
	this.name = key.replace(/^(-){1,2}/gi, '')
    this.alias = ''

	this.getValue = function() {
		return this.value;
	}

    this.setAlias = function(alias) {
        this.alias = alias;
    }
}

// define static methods
var flag = {};

flag.Flag = Flag;

// receives an array with two indices
// andcreates a new flag
flag.newFromArray = function(pair) {
    var key = flag.expandKeyFromAlias(pair[0])
	return new Flag(key, pair[1]);
};

// receives a flag key and does an alias lookup
// if a definition for a key is found, that
// definition is returned
flag.expandKeyFromAlias = function(key) {
    return aliases[key] || key;
}

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

// returns a flag from a set of flags with
// the specified flagname or alias
flag.getFlag = function(flags, flagname) {
	for (var i = 0; i < flags.length; i++) {
		if (flags[i].name == flagname || flags[i].alias == flagname) {
			return flags[i];
		}
	}
	return null;
}

module.exports = flag;

Graphy
======

Simple command-tree traverser. Search through every command in a tree, 
and filter results based on flags, usage, descriptions, or examples.

#### Traversal

Graphy aims to be command-agnostic; it makes use of `traversers` that know
how to walk through different commands. These are very small node.js
module files that make use of regular expressions (or any means of
identifying key-words in a command's usage output) to detect sub-commands
recursively.

#### Modules

Modules, like `traversers`, are small node.js module files that filter through
a `traverser`'s output, looking for a flag, example, or usage keywords. Each
module displays its information differently.

#### Running

`$ cd <path/to/graphy>`
`$ ./graphy --root=openshift --module=<module_name>`

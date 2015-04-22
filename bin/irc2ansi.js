#!/usr/bin/env node

var fs = require('fs');
var readline = require('readline');
var colorcode_to_ansi = require('../src/to_ansi');

var argv = require('minimist')(process.argv.slice(2), {
  alias: {p: "palette", h: "help", v: "version"},
  boolean: ['h', 'v']
});

// console.log(argv)

var opts = {};

if ("p" in argv) opts.palette = argv.p;

if (argv.v) {
    return console.log(require('../package.json').version);
}

// help or run without filename or piped in input
if ((argv.h) ||
    (argv._.length === 0 && process.stdin.isTTY)) {
  return fs.createReadStream(__dirname + '/help.txt')
           .pipe(process.stdout)
           .on('close', function () { process.exit(1) })
  ;
}

// passed a filename
if (argv._.length > 0){
  fs.readFile(argv._[0], 'utf8', function(err, data){
    if (err) return console.log(err);
    console.log(colorcode_to_ansi(data, opts))
  });

}

// piped in input
if (argv._.length === 0){
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  rl.on('line', function(line){
    console.log(colorcode_to_ansi(line, opts))
  });
}


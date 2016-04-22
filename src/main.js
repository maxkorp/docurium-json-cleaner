#!/usr/bin/env node

var path = require('path');
var fse = require('fs-extra');
var honey = require('json-honey');
var inPath = path.resolve(process.argv[2]);
var outPath = path.resolve(process.argv[3]);
var basejson = fse.readJsonSync(inPath);
delete basejson.prefix;
delete basejson.examples;
delete basejson.globals;

Object.keys(basejson.callbacks).forEach(function(name) {
  delete basejson.callbacks[name].description;
  delete basejson.callbacks[name].line;
  delete basejson.callbacks[name].lineto;
  delete basejson.callbacks[name].sig;
  delete basejson.callbacks[name].argline;
});

Object.keys(basejson.functions).forEach(function(name) {
  delete basejson.functions[name].line;
  delete basejson.functions[name].lineto;
  delete basejson.functions[name].examples;
  delete basejson.functions[name].sig;
  delete basejson.functions[name].argline;
  delete basejson.functions[name].description;
});

basejson.files.forEach(function(file) {
  delete file.lines;
  delete file.includes;
  delete file.group;
  delete file.meta;
  file.functions = file.functions.sort();
});

var groups = {};
basejson.groups.forEach(function(group) {
  groups[group[0]] = group[1].sort();
})
basejson.groups = groups;

var types = {};
basejson.types.forEach(function(type) {
  types[type[0]] = type[1];
  delete type[1].description;
  delete type[1].line;
  delete type[1].lineto;
  delete type[1].block;
  delete type[1].tdef;
});
basejson.types = types;

fse.writeFileSync(outPath, honey(basejson));

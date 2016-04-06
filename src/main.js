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

var groups = {};
basejson.groups.forEach(function(group) {
  groups[group[0]] = group[1];
})
basejson.groups = groups;

var types = {};
basejson.types.forEach(function(type) {
  types[type[0]] = type[1];
  delete type[1].comments;
  delete type[1].description;
  delete type[1].line;
  delete type[1].lineto;

  if (type[1].fields) {
    type[1].fields.forEach(function(field) {
      delete field.comments;
    });
  }
});
basejson.types = types;

fse.writeFileSync(outPath, honey(basejson));
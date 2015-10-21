#!/usr/bin/env node

'use strict';

var fn = require('./');

var argv = process.argv.slice(2);
if (argv.length !== 1) {
  console.log('Usage: md-link URL');
  process.exit(1);
}
var urlStr = argv.shift();

fn(urlStr, function(err, link) {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }
  console.log(link);
  process.exit(0);
});

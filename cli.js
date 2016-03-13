#!/usr/bin/env node

'use strict';

var clipboard = require('copy-paste');
var fn = require('./');

var argv = process.argv.slice(2);
if (argv.length !== 1) {
  console.log('Usage: md-link URL');
  process.exit(1);
}
var url = argv.shift();

fn(url, function(err, link) {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }
  clipboard.copy(link, function(err) {
    if (err) {
      console.log(err.messsage);
      process.exit(1);
    }
    console.log('The following text is copied to clipboard!')
    console.log(link);
    process.exit(0);
  });
});

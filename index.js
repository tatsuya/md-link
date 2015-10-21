'use strict';

var util = require('util');
var url = require('url');
var http = require('http');
var https = require('https');

var httpModules = {
  'http:': http,
  'https:': https
};

/**
 * Output log only if environment variable DEBUG is enabled.
 */
function debug() {
  if (process.env.DEBUG) {
    // Because arguments is an array-like object, it must be called with Function.prototype.apply().
    console.log('DEBUG: %s', util.format.apply(util, arguments));
  }
}

/**
 * Send a request for a given url and return response body.
 *
 * @param  {String}   urlStr
 * @param  {Function} callback
 */
function getBody(urlStr, callback) {
  var urlObj = url.parse(urlStr);
  var protocol = urlObj.protocol;

  var httpModule = httpModules[protocol];

  if (!httpModule) {
    return callback(new Error('Invalid protocol: ' + protocol));
  }

  httpModule.get(urlStr, function(res) {
    debug('status: ' + res.statusCode);
    debug('headers: ' + JSON.stringify(res.headers));

    var body = [];
    debug('reading response body');
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body.push(chunk);
    });
    res.on('end', function() {
      debug('end event');
      // If separator is an empty string, all elements are joined without any characters in between them.
      return callback(null, body.join(''));
    });
  }).on('error', function(err) {
    return callback(new Error('Failed to retrieve data for given URL: %s\nReason: %s', urlStr, err.message));
  });
}

/**
 * Find a title from HTML.
 *
 * @param  {String} html
 * @return {String}
 */
function findTitle(html) {
  // The flag 'i' represents case-insensitive search.
  var re = new RegExp('<title>(.*?)</title>', 'i');
  var matches = html.match(re);
  if (!matches) {
    return null;
  }
  return matches[1];
}

/**
 * Generate a markdown link from link text and url.
 *
 * @param  {String} linkText
 * @param  {String} url
 * @return {String}
 */
function createMarkdownLink(linkText, url) {
  return util.format('[%s](%s)', linkText, url);
}

module.exports = function(urlStr, callback) {
  getBody(urlStr, function(err, body) {
    if (err) {
      return callback(err);
    }
    debug(body);
    var title = findTitle(body);
    if (!title) {
      return callback(new Error('Title not found'));
    }
    var link = createMarkdownLink(title, urlStr);
    return callback(null, link);
  });
}

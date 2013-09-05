
(function () {

'use strict';

Crate.util = {};
Crate.util.path = {};

Crate.util.path.parse = function (rawPath) {
  // strip ending slash
  if (rawPath.charAt(rawPath.length - 1) == '/') {
    rawPath = rawPath.substring(0, rawPath.length - 1);
  }

  var path = rawPath.split('/');
  return path;
};

Crate.util.path.dirPath = function (rawPath) {
  var path = Crate.util.path.parse(rawPath);
  path.pop();
  var full = path.join('/');

  if (full == '') {
    full = '/';
  }

  return full;
};

Crate.util.path.filename = function (rawPath) {
  // make sure it isn't a directory
  if (rawPath.charAt(rawPath.length - 1) == '/') {
    return false;
  }

  var filename = rawPath.split('/').pop();

  return filename;
};

Crate.util.path.isAbsolute = function (path) {
  if (path.charAt(0) == '/') {
    return true;
  }

  return false;
};

Crate.util.path.isRoot = function (path) {
  path = Crate.util.path.parse(path);

  if (path.length == 1) {
    return true;
  }

  return false;
};

Crate.util.path.resolve = function () {
  var parts = [];

  for (var i in arguments) {
    // TODO check for string
    var path = Crate.util.path.parse(arguments[i]);
console.log(path);
    parts = parts.concat(path);
  }

console.log(parts);
  var realPath = [];

  for (var i in parts) {
    if (parts[i] == '.') {
      // do nothing?
    } else if (parts[i] == '..') {
      // remove last addition
      // only if we are above root
      if (realPath.length > 1) {
        realPath.pop();
      }
    } else {
      // add to array
      realPath.push(parts[i]);
    }
  }

console.log(realPath);
  return realPath.join('/');
};

})();

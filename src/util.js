
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

})();

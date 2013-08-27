
Crate.util = {};
Crate.util.path = {};

Crate.util.path.parse = function (rawPath) {
  var path = path.split('/');
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


(function () {

'use strict';

var Dentry = Crate.Dentry = function (options) {
  options = options || {};
  this.id = options.id; // child id
  this.name = options.name; // link name
};

Dentry.prototype.revalidate = function () {
  // TODO recheck link - need parent and child
  // is this necessary?
};

Dentry.prototype.serialize = function () {
  var data = {
    id: this.id,
    name: this.name
  };

  return data;
};

})();

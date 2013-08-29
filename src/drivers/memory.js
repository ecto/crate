
(function () {

'use strict';

var Memory = Crate.drivers.memory = function () {
  this.data = {
    inodes: {},
    dentries: {},
    files: {}
  };
};

Memory.prototype.load = function () {
};

Memory.prototype.createInode = function (id, callback) {
  if (this.data.inodes[id]) {
    callback('Inode already exists');
  }

  var inode = {};
  this.data.inodes[id] = inode;
  callback(null, inode);
};

Memory.prototype.loadInode = function (id, callback) {
  callback(null, {});
};

Memory.prototype.save = function () {
  console.log(this.data);
};

})();

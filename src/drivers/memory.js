
(function () {

'use strict';

var Memory = Crate.drivers.memory = function () {
  this.data = {
    inodes: {},
    dentries: {},
    files: {}
  };

  this.idCounter = 1;
};

Memory.prototype.load = function (data, callback) {
  callback && callback();
};

Memory.prototype.createInode = function (callback) {
  var id = this.idCounter;
  this.idCounter++;

  if (this.data.inodes[id]) {
    callback('Inode already exists');
  }

  var inode = {};
  inode.id = id;
  this.data.inodes[id] = inode;

  callback(null, inode);
};

Memory.prototype.loadInode = function (id, callback) {
  callback(null, {});
};

Memory.prototype.saveInode = function () {
  console.log(this.data);
};

})();


(function () {

'use strict';

var Memory = Crate.drivers.memory = function () {
  this.data = {
    inodes: {},
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

Memory.prototype.readInode = function (id, callback) {
  var data = this.data.inodes[id];

  if (!data) {
    return callback('Inode not found');
  }

  callback(null, data);
};

Memory.prototype.updateInode = function (data, callback) {
  var id = data.id;
  this.data.inodes[id] = data;
  callback(null);
};

Memory.prototype.destroyInode = function (id, callback) {
  delete this.data.inodes[id];
};

})();

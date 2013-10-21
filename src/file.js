
(function () {

'use strict';

var File = Crate.File = function (options) {
  options = options || {};
  this.id = options.id;
  this.inode = options.inode;
  this.system = options.system;

  // data
  // path (dentry)
  // mode?
  // version?
};

File.prototype.read = function (callback) {
  var that = this;

  that.system.driver.readFile(that.id, function (err, data) {
    that.data = data;
    callback(err, data);
  });
};

File.prototype.write = function (data, callback) {
  var that = this;

  that.system.driver.updateFile(that.id, data, function (err) {
    that.data = data;

    that.inode.size = byteCount(data);
    that.inode.mtime = +new Date();
    that.system.superblock.updateInode(that.inode.id, function () {
      callback(err);
    });
  });
};

File.prototype.readdir = function () {

};

File.prototype.poll = function () {

};

File.prototype.fsync = function () {

};

File.prototype.sendfile = function () {

};

})();
